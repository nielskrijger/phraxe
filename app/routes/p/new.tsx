import type { ActionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";
import { uniq } from "lodash";
import { PhraseShare } from "@prisma/client";
import { createPhrase } from "~/models/phrase.server";
import { requireUserId } from "~/session.server";
import { useEffect, useRef, useState } from "react";
import Button from "~/components/Button";
import H1 from "~/components/H1";
import Textarea from "~/components/Textarea";
import TagsInput from "~/components/TagsInput";
import Input from "~/components/Input";
import RadioGroup from "~/components/RadioGroup";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const text = formData.get("text") as string;
  const description = formData.get("description") as string;
  const attribution = formData.get("attribution") as string;
  const title = formData.get("title") as string;
  const source = formData.get("title") as string;
  const share = formData.get("share") as PhraseShare;

  const tags = uniq(
    (formData.get("tags") as string)
      .split("|")
      .map((s) => s.trim())
      .filter((t) => t)
  );

  const errors = {
    text: null as null | string,
    tags: null as null | string,
  };

  if (text.length === 0) {
    errors.text = "Text is required";
  }

  console.log("share", share);
  if (share == PhraseShare.PUBLIC && tags.length === 0) {
    errors.tags = "At least one tag is required when phrase is public";
  }

  if (tags.length > 3) {
    errors.tags = "Max 3 tags allowed";
  }

  if (!tags.every((tag) => /^[\w ]+$/.test(tag))) {
    errors.tags = "Can only contain letters and space(s)";
  }

  if (tags.some((tag) => tag.length > 20)) {
    errors.tags = "Max 20 characters allowed per tag";
  }

  if (Object.values(errors).some((e) => e !== null)) {
    return json({ errors }, { status: 400 });
  }

  const phrase = await createPhrase({
    language: "en", // TODO
    userId,
    text,
    share,
    title: title.length === 0 ? null : title,
    description: description.length === 0 ? null : description,
    attribution: attribution.length === 0 ? null : attribution,
    source: source.length === 0 ? null : source,
    tags,
  });

  return redirect(`/p/${phrase.id}`);
}

export const meta: MetaFunction = () => {
  return {
    title: "Add Phrase",
  };
};

export default function NewNotePage() {
  const actionData = useActionData<typeof action>();
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (actionData?.errors?.text) {
      textRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="my-2 px-3 lg:px-0">
      <Form method="post" className="flex flex-col gap-2" noValidate>
        <H1 className="pb-0">Add phrase</H1>

        <Input
          label="Title"
          placeholder="Murphy's Law"
          id="title"
          autoFocus={true}
          description="What the phrase is commonly referred as, otherwise leave empty"
        />

        <Textarea
          ref={textRef}
          id="text"
          label="Text *"
          minRows={2}
          error={actionData?.errors?.text}
          placeholder="Anything that can go wrong will go wrong, and at the worst possible time."
        />

        <Textarea id="description" minRows={3} label="Description" />

        <Input
          label="Attributed to"
          id="attribution"
          placeholder="Captain Edward Murphy"
        />

        <TagsInput id="tags" label="Tags" error={actionData?.errors?.tags} />

        <Input
          label="Source"
          id="source"
          placeholder="https://en.wikipedia.org/wiki/Murphy%27s_law"
        />

        <RadioGroup
          id="share"
          label="Share"
          value={PhraseShare.PRIVATE}
          options={[
            {
              value: "PRIVATE",
              title: "Private",
              description: "Only you can view and modify the phrase.",
            },
            {
              value: "OWNER_PUBLIC",
              title: "Public, maintain ownership",
              description:
                "Anyone can view this but it won't show up in search results.",
            },
            {
              value: "PUBLIC",
              title: "Public",
              description:
                "Anyone can view and search it. After 48 hours any changes are moderated and anyone can propose changes.",
            },
          ]}
        />

        <div className="mt-2">
          <Button>Create</Button>
        </div>
      </Form>
    </div>
  );
}
