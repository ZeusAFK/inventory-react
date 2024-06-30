import { Group, SegmentedControl } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { icons } from "../../assets";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const savedLanguage = localStorage.getItem("language") || i18n.language;
  const [language, setLanguage] = useState(savedLanguage);

  const availableLanguages = [
    { label: "ES", value: "es" },
    { label: "EN", value: "en" },
  ];

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
    localStorage.setItem("language", language);
  }, [i18n, language]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  return (
    <Group gap={0}>
      <icons.Language />
      <SegmentedControl
        radius="md"
        size="xs"
        defaultValue={language}
        value={language}
        onChange={handleLanguageChange}
        data={availableLanguages}
        withItemsBorders={false}
      />
    </Group>
  );
}
