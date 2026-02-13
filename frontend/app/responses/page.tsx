"use client";

import { useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

import Header from "@/app/landing/header/Header";
import ResponseCard from "@/app/components/ResponseCard";
import type { ResponseBadge } from "@/app/components/ResponseCard";
import { ArrowIcon } from "@/app/icons";
import styles from "./responses.module.scss";

interface Tab {
  key: string;
  label: string;
  count: number;
}

const tabs: Tab[] = [
  { key: "new", label: "Новые", count: 5 },
  { key: "review", label: "На рассмотрении", count: 2 },
  { key: "rejected", label: "Отклоненные", count: 2 },
  { key: "accepted", label: "Принятые", count: 2 },
  { key: "completed", label: "Завершены", count: 2 },
  { key: "archive", label: "Архив", count: 0 },
];

interface ResponseData {
  id: number;
  dateLabel: string;
  date: string;
  status: string;
  statusColor: string;
  statusBg: string;
  statusMessage?: string;
  orderTitle: string;
  customer: string;
  orderDate: string;
  badges: ResponseBadge[];
  sum: string;
  deadline: string;
  costEstimate: string;
  commissionText: string;
  commissionAmount: string;
  commissionStatus?: string;
  balanceReturnText?: string;
  balanceReturnAmount?: string;
  commentTitle: string;
  commentText: string;
  techSpecTitle?: string;
  techSpecFiles?: string[];
  reminderText?: string;
  reminderDays?: string;
  editBtnText?: string;
  payBtnText?: string;
  tabKey: string;
}

const mockResponses: ResponseData[] = [
  {
    id: 1,
    dateLabel: "Отклик от",
    date: "10.10.2025",
    status: "На рассмотрении",
    statusColor: "#CC6E00",
    statusBg: "#FFF5E6",
    orderTitle: "Экспертиза промышленной безопасности технических устройств",
    customer: "ООО «Ресурс Плюс»",
    orderDate: "12.01.2026",
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    sum: "150 000 ₽",
    deadline: "28.11.2025",
    costEstimate: "450 000 ₽",
    commissionText: "Взнос в размере",
    commissionAmount: "42 500 ₽",
    commissionStatus: "получен",
    commentTitle: "Комментарий:",
    commentText:
      "Готовы приступить к работе в кратчайшие сроки. Имеем все необходимые допуски и лицензии.",
    techSpecTitle: "Техническое задание:",
    techSpecFiles: ["Техническое_задание.pdf"],
    tabKey: "review",
  },
  {
    id: 2,
    dateLabel: "Отклик от",
    date: "11.10.2025",
    status: "На рассмотрении",
    statusColor: "#CC6E00",
    statusBg: "#FFF5E6",
    orderTitle: "Экспертиза промышленной безопасности зданий и сооружений",
    customer: "ПАО «Газпром»",
    orderDate: "15.01.2026",
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    sum: "250 000 ₽",
    deadline: "15.12.2025",
    costEstimate: "220 000 ₽",
    commissionText: "Взнос в размере",
    commissionAmount: "22 000 ₽",
    commissionStatus: "получен",
    commentTitle: "Комментарий:",
    commentText:
      "Предлагаем выполнить экспертизу с привлечением аттестованных специалистов.",
    techSpecTitle: "Техническое задание:",
    techSpecFiles: ["ТЗ_здания.pdf"],
    tabKey: "review",
  },
  {
    id: 3,
    dateLabel: "Отклик от",
    date: "08.10.2025",
    status: "Новый",
    statusColor: "#1565C0",
    statusBg: "#E3F2FD",
    orderTitle: "Экспертиза промышленной безопасности технических устройств",
    customer: "АО «Транснефть»",
    orderDate: "20.01.2026",
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    sum: "180 000 ₽",
    deadline: "25.11.2025",
    costEstimate: "160 000 ₽",
    commissionText: "Взнос в размере",
    commissionAmount: "16 000 ₽",
    commissionStatus: "получен",
    commentTitle: "Комментарий:",
    commentText: "Опыт работы с аналогичными объектами более 10 лет.",
    tabKey: "new",
  },
  {
    id: 4,
    dateLabel: "Отклик от",
    date: "07.10.2025",
    status: "Новый",
    statusColor: "#1565C0",
    statusBg: "#E3F2FD",
    orderTitle: "Экспертиза промышленной безопасности технических устройств",
    customer: "ООО «НефтеГазСервис»",
    orderDate: "22.01.2026",
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    sum: "320 000 ₽",
    deadline: "20.12.2025",
    costEstimate: "290 000 ₽",
    commissionText: "Взнос в размере",
    commissionAmount: "29 000 ₽",
    commissionStatus: "получен",
    commentTitle: "Комментарий:",
    commentText:
      "Гарантируем качественное выполнение работ в установленные сроки.",
    techSpecTitle: "Техническое задание:",
    techSpecFiles: ["ТЗ_устройства.pdf"],
    tabKey: "new",
  },
  {
    id: 5,
    dateLabel: "Отклик от",
    date: "05.10.2025",
    status: "Новый",
    statusColor: "#1565C0",
    statusBg: "#E3F2FD",
    orderTitle: "Экспертиза промышленной безопасности зданий и сооружений",
    customer: "ПАО «Лукойл»",
    orderDate: "25.01.2026",
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    sum: "410 000 ₽",
    deadline: "10.12.2025",
    costEstimate: "380 000 ₽",
    commissionText: "Взнос в размере",
    commissionAmount: "38 000 ₽",
    commissionStatus: "получен",
    commentTitle: "Комментарий:",
    commentText: "Полный комплекс экспертных работ с выездом на объект.",
    tabKey: "new",
  },
  {
    id: 6,
    dateLabel: "Отклик от",
    date: "03.10.2025",
    status: "Новый",
    statusColor: "#1565C0",
    statusBg: "#E3F2FD",
    orderTitle: "Экспертиза промышленной безопасности технических устройств",
    customer: "ООО «ПромЭкспертиза»",
    orderDate: "28.01.2026",
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    sum: "195 000 ₽",
    deadline: "05.12.2025",
    costEstimate: "170 000 ₽",
    commissionText: "Взнос в размере",
    commissionAmount: "17 000 ₽",
    commissionStatus: "получен",
    commentTitle: "Комментарий:",
    commentText:
      "Выполним работу качественно и в срок. Аккредитованная лаборатория.",
    tabKey: "new",
  },
  {
    id: 7,
    dateLabel: "Отклик от",
    date: "01.10.2025",
    status: "Новый",
    statusColor: "#1565C0",
    statusBg: "#E3F2FD",
    orderTitle: "Экспертиза промышленной безопасности технических устройств",
    customer: "АО «Сибур»",
    orderDate: "01.02.2026",
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    sum: "275 000 ₽",
    deadline: "01.12.2025",
    costEstimate: "250 000 ₽",
    commissionText: "Взнос в размере",
    commissionAmount: "25 000 ₽",
    commissionStatus: "получен",
    commentTitle: "Комментарий:",
    commentText: "Предлагаем конкурентные условия. Команда из 5 экспертов.",
    tabKey: "new",
  },
  {
    id: 8,
    dateLabel: "Отклик от",
    date: "25.09.2025",
    status: "Отклонен",
    statusColor: "#C62828",
    statusBg: "#FFEBEE",
    orderTitle: "Экспертиза промышленной безопасности зданий и сооружений",
    customer: "ООО «ТехноСервис»",
    orderDate: "05.02.2026",
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    sum: "340 000 ₽",
    deadline: "15.11.2025",
    costEstimate: "310 000 ₽",
    commissionText: "Взнос в размере",
    commissionAmount: "31 000 ₽",
    commissionStatus: "получен",
    commentTitle: "Комментарий:",
    commentText: "Были готовы начать немедленно.",
    tabKey: "rejected",
  },
  {
    id: 9,
    dateLabel: "Отклик от",
    date: "20.09.2025",
    status: "Отклонен",
    statusColor: "#C62828",
    statusBg: "#FFEBEE",
    orderTitle: "Экспертиза промышленной безопасности технических устройств",
    customer: "ПАО «Роснефть»",
    orderDate: "08.02.2026",
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    sum: "520 000 ₽",
    deadline: "05.11.2025",
    costEstimate: "480 000 ₽",
    commissionText: "Взнос в размере",
    commissionAmount: "48 000 ₽",
    commissionStatus: "получен",
    commentTitle: "Комментарий:",
    commentText:
      "Предложение было направлено с полным пакетом документов.",
    tabKey: "rejected",
  },
  {
    id: 10,
    dateLabel: "Отклик от",
    date: "18.09.2025",
    status: "Принято",
    statusColor: "#137333",
    statusBg: "#E6F4EA",
    statusMessage: "Заказчик выбрал вас!",
    orderTitle: "Экспертиза промышленной безопасности технических устройств",
    customer: "ООО «Энергомаш»",
    orderDate: "10.02.2026",
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    sum: "165 000 ₽",
    deadline: "28.11.2025",
    costEstimate: "145 000 ₽",
    commissionText: "Взнос в размере",
    commissionAmount: "42 500 ₽",
    commissionStatus: "получен",
    balanceReturnText: "На ваш баланс вернется",
    balanceReturnAmount: "17 500 ₽",
    commentTitle: "Комментарий:",
    commentText: "Заказ принят к исполнению. Работа начата.",
    techSpecTitle: "Техническое задание:",
    techSpecFiles: ["ТЗ_энергомаш.pdf"],
    tabKey: "accepted",
  },
  {
    id: 11,
    dateLabel: "Отклик от",
    date: "15.09.2025",
    status: "Принято",
    statusColor: "#137333",
    statusBg: "#E6F4EA",
    statusMessage: "Заказчик выбрал вас!",
    orderTitle: "Экспертиза промышленной безопасности зданий и сооружений",
    customer: "АО «Норильский никель»",
    orderDate: "12.02.2026",
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    sum: "480 000 ₽",
    deadline: "10.12.2025",
    costEstimate: "440 000 ₽",
    commissionText: "Взнос в размере",
    commissionAmount: "44 000 ₽",
    commissionStatus: "получен",
    balanceReturnText: "На ваш баланс вернется",
    balanceReturnAmount: "22 000 ₽",
    commentTitle: "Комментарий:",
    commentText: "Экспертиза в процессе выполнения.",
    techSpecTitle: "Техническое задание:",
    techSpecFiles: ["ТЗ_никель.pdf"],
    tabKey: "accepted",
  },
  {
    id: 12,
    dateLabel: "Отклик от",
    date: "10.09.2025",
    status: "Завершен",
    statusColor: "#555555",
    statusBg: "#F5F5F5",
    orderTitle: "Экспертиза промышленной безопасности технических устройств",
    customer: "ООО «СтройМонтаж»",
    orderDate: "14.02.2026",
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    sum: "210 000 ₽",
    deadline: "10.11.2025",
    costEstimate: "190 000 ₽",
    commissionText: "Взнос в размере",
    commissionAmount: "19 000 ₽",
    commissionStatus: "получен",
    commentTitle: "Комментарий:",
    commentText: "Работа завершена. Все документы переданы заказчику.",
    techSpecTitle: "Техническое задание:",
    techSpecFiles: ["Заключение.pdf", "Акт_приемки.pdf"],
    tabKey: "completed",
  },
  {
    id: 13,
    dateLabel: "Отклик от",
    date: "05.09.2025",
    status: "Завершен",
    statusColor: "#555555",
    statusBg: "#F5F5F5",
    orderTitle: "Экспертиза промышленной безопасности зданий и сооружений",
    customer: "ПАО «Северсталь»",
    orderDate: "01.02.2026",
    badges: [
      { text: "Э4 ТУ", variant: "blue" },
      { text: "Э4 ОБ", variant: "green" },
    ],
    sum: "360 000 ₽",
    deadline: "01.11.2025",
    costEstimate: "330 000 ₽",
    commissionText: "Взнос в размере",
    commissionAmount: "33 000 ₽",
    commissionStatus: "получен",
    commentTitle: "Комментарий:",
    commentText: "Экспертиза успешно завершена. Заключение выдано.",
    tabKey: "completed",
  },
];

export default function ResponsesPage() {
  const [activeTab, setActiveTab] = useState("new");
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredResponses = mockResponses.filter(
    (r) => r.tabKey === activeTab
  );

  const totalPages = filteredResponses.length;

  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      setActiveIndex(swiper.realIndex);
      setCurrentPage(swiper.realIndex + 1);
    },
    []
  );

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    swiperRef?.slideToLoop(page - 1);
  };

  const handlePrev = () => {
    swiperRef?.slidePrev();
  };

  const handleNext = () => {
    swiperRef?.slideNext();
  };

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    setActiveIndex(0);
    setCurrentPage(1);
    swiperRef?.slideToLoop(0);
  };

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.shadeLeft} />
        <div className={styles.shadeRight} />

        <div className={styles.tabBar}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${
                tab.count > 0 ? styles.tabWithCount : ""
              } ${activeTab === tab.key ? styles.tabActive : ""}`}
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={styles.tabCount}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        <div className={styles.cardsSection}>
          <Swiper
            className={styles.swiper}
            modules={[Navigation]}
            slidesPerView="auto"
            spaceBetween={16}
            centeredSlides
            loop
            breakpoints={{
              769: {
                spaceBetween: 20,
              },
            }}
            onSwiper={setSwiperRef}
            onSlideChange={handleSlideChange}
          >
            {filteredResponses.map((response, index) => (
              <SwiperSlide key={response.id} className={styles.slide}>
                <div
                  className={`${styles.slideInner} ${
                    index === activeIndex ? styles.slideActive : ""
                  }`}
                >
                  <ResponseCard
                    dateLabel={response.dateLabel}
                    date={response.date}
                    status={response.status}
                    statusColor={response.statusColor}
                    statusBg={response.statusBg}
                    statusMessage={response.statusMessage}
                    orderTitle={response.orderTitle}
                    customer={response.customer}
                    orderDate={response.orderDate}
                    badges={response.badges}
                    sum={response.sum}
                    deadline={response.deadline}
                    costEstimate={response.costEstimate}
                    commissionText={response.commissionText}
                    commissionAmount={response.commissionAmount}
                    commissionStatus={response.commissionStatus}
                    balanceReturnText={response.balanceReturnText}
                    balanceReturnAmount={response.balanceReturnAmount}
                    commentTitle={response.commentTitle}
                    commentText={response.commentText}
                    techSpecTitle={response.techSpecTitle}
                    techSpecFiles={response.techSpecFiles}
                    reminderText={response.reminderText}
                    reminderDays={response.reminderDays}
                    editBtnText={response.editBtnText}
                    payBtnText={response.payBtnText}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={styles.pagination}>
            <button
              className={styles.slideBtn}
              onClick={handlePrev}
              aria-label="Назад"
            >
              <ArrowIcon className={styles.arrowLeft} color="#FFDDA9" />
            </button>

            <div className={styles.pages}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`${styles.pageBtn} ${
                      page === currentPage ? styles.pageBtnActive : ""
                    }`}
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              className={styles.slideBtn}
              onClick={handleNext}
              aria-label="Вперед"
            >
              <ArrowIcon color="#FFDDA9" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
