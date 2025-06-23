import {PageResponseDto} from "./page-response.dto";
import {GameHistoryResponse} from "./game-history-response.interface";

export const EMPTY_PAGE_RESPONSE: PageResponseDto<GameHistoryResponse> = {
  data: [],
  meta: {
    page: 1,
    take: 5,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  }
};
