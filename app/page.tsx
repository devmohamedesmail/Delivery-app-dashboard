'use client'
import { Button } from "@/components/ui/button";
import ToggleLang from "@/components/ui/toggle-lang";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation()
  return (
    <>

    <Button>{t("home")}</Button>
    <ToggleLang />
    </>
  );
}
