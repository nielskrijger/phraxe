import { ThumbUpOutlined, ThumbDownOutlined } from "@mui/icons-material";
import { humanizeNumber } from "~/utils/format";
import type { Like as LikeType, LikeObjectType } from "@prisma/client";
import { Form } from "@remix-run/react";
import { useState } from "react";

type Props = {
  count: number;
  sum: number;
  objectId: string;
  objectType: LikeObjectType;
  like?: LikeType;
};

export default function Like({
  count,
  sum,
  objectId,
  objectType,
  like,
}: Props) {
  const [like, setLike] = useState(like.is);
  return (
    <div className="flex w-fit rounded-xl bg-slate-200 text-lg text-slate-800">
      <Form method="post" action="/like">
        <input type="hidden" name="objectId" value={objectId} />
        <input type="hidden" name="objectType" value={objectType} />
        <button
          onClick={(e) => e.stopPropagation()}
          type="submit"
          name="_action"
          value="like"
          aria-label="Like"
          className="cursor-pointer rounded-bl-xl rounded-tl-xl py-1.5 pl-3 pr-2 leading-none hover:bg-slate-300"
        >
          <>
            <ThumbUpOutlined fontSize="small" />{" "}
            {sum > 0 ? humanizeNumber(sum) : ""}
          </>
        </button>
      </Form>
      <div className="flex w-[1px] items-center bg-slate-200">
        <div className="h-[70%] border-l border-slate-500" />
      </div>
      <Form method="post">
        <button
          onClick={(e) => e.stopPropagation()}
          type="submit"
          name="_action"
          value="dislike"
          aria-label="Dislike"
          className="cursor-pointer rounded-br-xl rounded-tr-xl py-1.5 pr-3 pl-2 leading-none hover:bg-slate-300"
        >
          <input type="hidden" name="objectId" value={objectId} />
          <input type="hidden" name="objectType" value={objectType} />
          <ThumbDownOutlined fontSize="small" />
          {sum > 0 ? humanizeNumber(count - sum) : ""}
        </button>
      </Form>
    </div>
  );
}
