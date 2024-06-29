import { SegmentedControl } from "@mantine/core";
import { useState } from "react";

export function LanguageSwitcher() {
  const [value, setValue] = useState("es");

  return (
    <SegmentedControl
      radius="md"
      size="xs"
      value={value}
      onChange={setValue}
      data={[
        { label: "ES", value: "es" },
        { label: "EN", value: "en" },
      ]}
    />
  );
}
