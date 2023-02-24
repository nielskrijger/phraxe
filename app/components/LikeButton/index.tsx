import {
  ThumbDown,
  ThumbDownOutlined,
  ThumbUp,
  ThumbUpOutlined,
} from "@mui/icons-material";
import { humanizeNumber } from "~/utils/format";
import type { Like, LikeObjectType } from "@prisma/client";
import { useFetcher, useLocation } from "@remix-run/react";
import type { FormEvent } from "react";
import { useEffect, useReducer, useState } from "react";
import type { FormMethod } from "@remix-run/router";
import { LikeAction, likeReducer } from "~/components/LikeButton/likeReducer";
import { useDebounce } from "~/utils/debounce";
import { useOptionalUser } from "~/utils/user";
import { useNavigate } from "@remix-run/react";
import { createSearchParams } from "react-router-dom";

type Props = {
  count: number;
  total: number;
  objectId: string;
  objectType: LikeObjectType;
  like: Pick<Like, "isDislike"> | null;
};

export default function Select({
  count,
  total,
  objectId,
  objectType,
  like,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useOptionalUser();
  const fetcher = useFetcher();
  const initialState = {
    count,
    total,
    isLiked: !like ? null : !like.isDislike,
  };
  const [state, dispatch] = useReducer(likeReducer, initialState);
  const [action, setAction] = useState<null | LikeAction>(null);
  const [debouncedAction] = useDebounce(action, 300);

  const determineAction = (action: LikeAction) => {
    if (action === LikeAction.Like && state.isLiked) {
      return LikeAction.DeleteLike;
    }
    if (action === LikeAction.Dislike && state.isLiked === false) {
      return LikeAction.DeleteDislike;
    }
    return action;
  };

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>,
    action: LikeAction.Like | LikeAction.Dislike
  ) => {
    e.preventDefault();

    if (!user) {
      const search = createSearchParams({ redirectTo: location.pathname });
      navigate({ pathname: "/login", search: `?${search}` });
      return;
    }

    const newAction = determineAction(action);
    dispatch({ type: newAction });
    setAction(newAction);
  };

  useEffect(() => {
    if (!debouncedAction) {
      return;
    }

    const formData = new FormData();
    let method: FormMethod = "post";
    if (
      debouncedAction === LikeAction.DeleteLike ||
      debouncedAction === LikeAction.DeleteDislike
    ) {
      method = "delete";
    }

    formData.set(
      "isDislike",
      debouncedAction === LikeAction.Dislike ? "true" : "false"
    );
    formData.set("objectId", objectId);
    formData.set("objectType", objectType);

    fetcher.submit(formData, { method, action: "/like" });
    // Fetcher is unstable, so exclude from dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAction, objectId, objectType]);

  // divide by two because a like is 1, a dislike -2 (diff 2)
  const dislikes = (state.count - state.total) / 2;
  const likes = state.count - dislikes;

  return (
    <div className="flex w-fit rounded-xl bg-slate-100 text-lg text-slate-800">
      <fetcher.Form
        method="post"
        onSubmit={(e) => handleSubmit(e, LikeAction.Like)}
        preventScrollReset
      >
        <button
          type="submit"
          aria-label="Select"
          className="cursor-pointer rounded-bl-xl rounded-tl-xl py-1.5 pl-3 pr-2 leading-none hover:bg-indigo-100 hover:text-indigo-600"
          onClick={(e) => e.stopPropagation()}
        >
          <>
            {state.isLiked === true ? (
              <ThumbUp fontSize="small" />
            ) : (
              <ThumbUpOutlined fontSize="small" />
            )}{" "}
            {likes > 0 ? humanizeNumber(likes) : ""}
          </>
        </button>
      </fetcher.Form>

      <div className="flex w-[1px] items-center bg-slate-100">
        <div className="h-[70%] border-l border-slate-400" />
      </div>

      <fetcher.Form
        method="post"
        onSubmit={(e) => handleSubmit(e, LikeAction.Dislike)}
        preventScrollReset
      >
        <button
          type="submit"
          aria-label="Dislike"
          className="cursor-pointer rounded-br-xl rounded-tr-xl py-1.5 pr-3 pl-2 leading-none hover:bg-indigo-100 hover:text-indigo-600"
          onClick={(e) => e.stopPropagation()}
        >
          {state.isLiked === false ? (
            <ThumbDown fontSize="small" />
          ) : (
            <ThumbDownOutlined fontSize="small" />
          )}{" "}
          {dislikes > 0 ? humanizeNumber(dislikes) : ""}
        </button>
      </fetcher.Form>
    </div>
  );
}
