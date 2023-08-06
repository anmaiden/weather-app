import React from "react";
import "../../i18n";
import { useTranslation } from "react-i18next";

interface DaysOfWeek {
  [key: number]: string;
}

interface MonthNames {
  [key: number]: string;
}

const CurrentDate: React.FC = () => {
  const { t } = useTranslation();
  const now: Date = new Date();
  const daysOfWeek = t("daysOfWeek", { returnObjects: true }) as DaysOfWeek;
  const monthNames = t("monthNames", { returnObjects: true }) as MonthNames;
  const dayOfWeek = daysOfWeek[now.getDay()];
  const monthName = monthNames[now.getMonth()];
  const timeOfDay = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div>
      {dayOfWeek}, {now.getDate()} {monthName}, {timeOfDay}
    </div>
  );
};

export default CurrentDate;
