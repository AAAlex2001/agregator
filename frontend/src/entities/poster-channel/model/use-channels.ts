"use client";

import { useEffect, useState } from "react";
import { getChannels } from "../api/get-channels";
import type { PosterChannel } from "./types";

/** Каналы из последнего ответа, ошибка и номер запроса, который их вернул. */
interface ChannelsState {
  channels: PosterChannel[];
  error: string | null;
  loadedVersion: number | null;
}

/**
 * Свои каналы. Список перечитывается, когда пользователь возвращается на вкладку:
 * канал подключают в Telegram, а потом возвращаются на сайт.
 */
export function useChannels() {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState<ChannelsState>({
    channels: [],
    error: null,
    loadedVersion: null,
  });

  useEffect(() => {
    let isActive = true;

    getChannels()
      .then((channels) => {
        if (isActive) {
          setState({ channels, error: null, loadedVersion: version });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            channels: [],
            error: error instanceof Error ? error.message : "Не удалось загрузить каналы",
            loadedVersion: version,
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [version]);

  useEffect(() => {
    /** Перечитывает список, когда вкладка снова видна. */
    function reloadOnReturn() {
      if (document.visibilityState === "visible") {
        setVersion((current) => current + 1);
      }
    }

    document.addEventListener("visibilitychange", reloadOnReturn);

    return () => {
      document.removeEventListener("visibilitychange", reloadOnReturn);
    };
  }, []);

  /** Показывает канал, который вернул сервер после обновления. */
  function replaceChannel(channel: PosterChannel) {
    setState((current) => ({
      ...current,
      channels: current.channels.map((item) => (item.id === channel.id ? channel : item)),
    }));
  }

  /** Убирает отключённый канал из списка. */
  function removeChannel(id: number) {
    setState((current) => ({
      ...current,
      channels: current.channels.filter((item) => item.id !== id),
    }));
  }

  return {
    channels: state.channels,
    error: state.error,
    isLoading: state.loadedVersion === null,
    replaceChannel,
    removeChannel,
  };
}
