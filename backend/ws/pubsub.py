import asyncio
import contextlib
import json
import logging
import os
from typing import Any, Awaitable, Callable

import redis.asyncio as redis

log = logging.getLogger(__name__)

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")

Handler = Callable[[dict[str, Any]], Awaitable[None]]


class WsPubSub:
    def __init__(self) -> None:
        self.publisher: redis.Redis | None = None
        self.subscriber: redis.Redis | None = None
        self.pubsub_conn = None
        self.listener_task: asyncio.Task | None = None
        self.handlers: dict[str, Handler] = {}

    def register(self, channel: str, handler: Handler) -> None:
        self.handlers[channel] = handler

    async def start(self) -> None:
        try:
            self.publisher = redis.from_url(
                REDIS_URL,
                decode_responses=True,
                health_check_interval=30,
                socket_keepalive=True,
                retry_on_timeout=True,
            )
            await self.publisher.ping()

            self.subscriber = redis.from_url(
                REDIS_URL,
                decode_responses=True,
                health_check_interval=30,
                socket_keepalive=True,
                retry_on_timeout=True,
            )
            self.pubsub_conn = self.subscriber.pubsub(ignore_subscribe_messages=True)
            if self.handlers:
                await self.pubsub_conn.subscribe(*self.handlers.keys())
            self.listener_task = asyncio.create_task(self._run(), name="ws_pubsub_listener")
            log.info("ws_pubsub: started, channels=%s", list(self.handlers.keys()))
        except Exception:
            log.exception("ws_pubsub: failed to start, broadcast will be local-only")

    async def stop(self) -> None:
        if self.listener_task is not None:
            self.listener_task.cancel()
            with contextlib.suppress(asyncio.CancelledError, Exception):
                await self.listener_task
            self.listener_task = None

        if self.pubsub_conn is not None:
            with contextlib.suppress(Exception):
                await self.pubsub_conn.unsubscribe()
            with contextlib.suppress(Exception):
                await self.pubsub_conn.aclose()
            self.pubsub_conn = None

        if self.subscriber is not None:
            with contextlib.suppress(Exception):
                await self.subscriber.aclose()
            self.subscriber = None

        if self.publisher is not None:
            with contextlib.suppress(Exception):
                await self.publisher.aclose()
            self.publisher = None

        log.info("ws_pubsub: stopped")

    async def publish(self, channel: str, payload: dict[str, Any]) -> None:
        if self.publisher is None:
            return
        try:
            await self.publisher.publish(channel, json.dumps(payload, default=str))
        except Exception:
            log.exception("ws_pubsub: publish failed channel=%s", channel)

    async def _run(self) -> None:
        backoff = 1.0
        while True:
            if self.pubsub_conn is None:
                return
            try:
                async for message in self.pubsub_conn.listen():
                    if message.get("type") != "message":
                        continue
                    channel = message.get("channel")
                    handler = self.handlers.get(channel)
                    if handler is None:
                        continue
                    try:
                        payload = json.loads(message.get("data") or "null")
                    except (TypeError, json.JSONDecodeError):
                        log.warning("ws_pubsub: invalid json in channel=%s", channel)
                        continue
                    try:
                        await handler(payload)
                    except Exception:
                        log.exception("ws_pubsub: handler crashed channel=%s", channel)
                backoff = 1.0
            except asyncio.CancelledError:
                raise
            except Exception:
                log.exception("ws_pubsub: listener crashed, reconnecting in %.1fs", backoff)
                await asyncio.sleep(backoff)
                backoff = min(backoff * 2, 30.0)
                with contextlib.suppress(Exception):
                    if self.pubsub_conn is not None and self.handlers:
                        await self.pubsub_conn.subscribe(*self.handlers.keys())


ws_pubsub = WsPubSub()
