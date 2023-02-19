import React from "react";
import type { Phrase as PhraseType, Tag, User } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import Card from "~/components/Card";
import { useNavigate } from "@remix-run/react";
import PhraseContent from "~/components/PhraseContent";

type Props = {
  phrase: SerializeFrom<PhraseType> & {
    tags: SerializeFrom<Tag>[];
    user: Pick<User, "username" | "usernameLower"> | null;
  };
};

export default function Phrase({ phrase }: Props) {
  const navigate = useNavigate();
  return (
    <Card
      key={phrase.id}
      onClick={() => navigate(`/p/${phrase.id}/${phrase.slug}`)}
    >
      <PhraseContent phrase={phrase} />
    </Card>
  );
}
