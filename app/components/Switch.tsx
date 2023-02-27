import * as React from "react";
import { Switch as HeadlessSwitch } from "@headlessui/react";
import clsx from "clsx";

interface Props {
  id: string;
  enabled: boolean;
  className?: string;
  label: string;
  onChange?(checked: boolean): void;
}
export default function Switch({
  id,
  className,
  label,
  enabled,
  onChange,
}: Props) {
  return (
    <HeadlessSwitch.Group>
      <div className={clsx(className, "flex items-center")}>
        <HeadlessSwitch.Label className="mr-4">{label}</HeadlessSwitch.Label>
        <HeadlessSwitch
          id={id}
          name={id}
          checked={enabled}
          onChange={onChange}
          className={`${
            enabled ? "bg-primary" : "bg-slate-200"
          } relative inline-flex h-6 min-w-[40px] max-w-[40px] items-center rounded-full`}
        >
          <span className="sr-only">Enable notifications</span>
          <span
            className={`${
              enabled ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </HeadlessSwitch>
      </div>
    </HeadlessSwitch.Group>
  );
}
