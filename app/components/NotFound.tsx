import Card from "~/components/Card";
import React from "react";

type Props = {
  title: string;
};

export default function NotFound({ title }: Props) {
  return (
    <Card className="grid h-[100px] items-center justify-center bg-slate-50">
      {title}
    </Card>
  );
}
