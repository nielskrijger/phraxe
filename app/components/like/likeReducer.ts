export enum LikeAction {
  Like = "LIKE",
  DeleteLike = "DELETE_LIKE",
  Dislike = "DISLIKE",
  DeleteDislike = "DELETE_DISLIKE",
}

type Like = { type: LikeAction.Like };
type DeleteLike = { type: LikeAction.DeleteLike };
type Dislike = { type: LikeAction.Dislike };
type DeleteDislike = { type: LikeAction.DeleteDislike };

export type LikeState = {
  count: number;
  total: number;
  isLiked: boolean | null; // null indicates no like
};

/**
 * likeReducer handles client-side state updates when submitting a like or
 * dislike. Doing this ensures front-end state changes are immediate.
 */
export function likeReducer(
  state: LikeState,
  action: Like | DeleteLike | Dislike | DeleteDislike
) {
  switch (action.type) {
    case LikeAction.Like:
      // New like
      if (state.isLiked === null) {
        return {
          ...state,
          count: state.count + 1,
          total: state.total + 1,
          isLiked: true,
        };
      }

      // Change dislike to like
      return {
        ...state,
        total: state.total + 2,
        isLiked: true,
      };
    // Remove like
    case LikeAction.DeleteLike:
      return {
        ...state,
        count: state.count - 1,
        total: state.total - 1,
        isLiked: null,
      };
    case LikeAction.Dislike:
      // New dislike
      if (state.isLiked === null) {
        return {
          ...state,
          count: state.count + 1,
          total: state.total - 1,
          isLiked: false,
        };
      }

      // Change like to dislike
      return {
        ...state,
        total: state.total - 2,
        isLiked: false,
      };
    // Remove dislike
    case LikeAction.DeleteDislike:
      return {
        ...state,
        count: state.count - 1,
        total: state.total + 1,
        isLiked: null,
      };
    default:
      return state;
  }
}
