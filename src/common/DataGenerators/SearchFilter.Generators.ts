import {
  IContainsFilterValue,
  IContainsInListFilterValue,
  IContainsLikeTextFitlerValue,
  IExactMatchFilterValue,
  IGreaterThanFilterValue,
  IGreaterThanOrEqualFilterValue,
  IInListFilterValue,
  ILessThanFilterValue,
  ILessThanOrEqualFilterValue,
  ILikeTextFilterValue,
  INestedFieldSearchFilterConstraint,
  INotContainsInListFilterValue,
  INotEqualFilterValue,
  INotInListFilterValue,
  IRangeFilterValue,
  ISearchFilter,
  ISearchFilterConstraint,
  ITemporalDateRangeFilterValue,
  ModuleProperty,
  SearchFilterType,
  SearchFilterValuePrimitives,
  SearchFilterValueType,
} from 'bf-types';

export type SearchFilterPair = [string | ModuleProperty, SearchFilterValueType];
export type PairOrFilter = ISearchFilter | SearchFilterPair;

export function searchFilter(fieldName: string | ModuleProperty, fieldValue: SearchFilterValueType): ISearchFilter {
  return {
    field_name: fieldName,
    field_value: fieldValue,
  };
}

export function searchFilters(...filters: PairOrFilter[]): ISearchFilter[] {
  return filters.map(searchFilterPairToObject);
}

export const containsFilter = makeFilter(SearchFilterType.CONTAINS)<IContainsFilterValue>()(fromPrimitive);

export const containsLikeTextFitler = makeFilter(SearchFilterType.CONTAINS_LIKE_TEXT)<IContainsLikeTextFitlerValue>()(
  fromString,
);

export const containsInListFilter = makeFilter(SearchFilterType.CONTAINS_IN_LIST)<IContainsInListFilterValue>()(
  fromPrimitives,
);

export const exactMatchFilter = makeFilter(SearchFilterType.EXACT_MATCH)<IExactMatchFilterValue>()(fromPrimitive);

export const greaterThanFilter = makeFilter(SearchFilterType.GREATER_THAN)<IGreaterThanFilterValue>()(fromPrimitive);

export const greaterThanOrEqualFilter = makeFilter(SearchFilterType.GREATER_THAN_OR_EQUAL)<
  IGreaterThanOrEqualFilterValue
>()(fromPrimitive);

export const inListFilter = makeFilter(SearchFilterType.IN_LIST)<IInListFilterValue>()(fromPrimitives);

export const lessThanFilter = makeFilter(SearchFilterType.LESS_THAN)<ILessThanFilterValue>()(fromPrimitive);

export const lessThanOrEqualFilter = makeFilter(SearchFilterType.LESS_THAN_OR_EQUAL)<ILessThanOrEqualFilterValue>()(
  fromPrimitive,
);

export const likeTextFilter = makeFilter(SearchFilterType.LIKE_TEXT)<ILikeTextFilterValue>()(fromString);

export const notContainsInListFilter = makeFilter(SearchFilterType.NOT_CONTAINS_IN_LIST)<
  INotContainsInListFilterValue
>()(fromPrimitives);

export const notEqualFilter = makeFilter(SearchFilterType.NOT_EQUAL)<INotEqualFilterValue>()(fromPrimitive);

export const notInListFilter = makeFilter(SearchFilterType.NOT_IN_LIST)<INotInListFilterValue>()(fromPrimitives);

export const rangeFilter = makeFilter(SearchFilterType.RANGE)<IRangeFilterValue>()(fromRange);

export const temporalDateRangeFilter = makeFilter(SearchFilterType.TEMPORAL_DATE_RANGE)<
  ITemporalDateRangeFilterValue
>()(fromTemporalRange);

type Args<T> = T extends (...args: infer A) => any ? A : never;
type Func<R> = (...args: any[]) => R;

function makeFilter(type: SearchFilterType) {
  return <V extends SearchFilterValueType>() => <R extends Func<Omit<V, 'type'>> = Func<Omit<V, 'type'>>>(run: R) => {
    return (fieldName: string | ModuleProperty, ...params: Args<R>): ISearchFilter => ({
      field_name: fieldName,
      field_value: withType(type)(run(...params)),
    });
  };
}

function fromPrimitive(value: SearchFilterValuePrimitives, constraint?: INestedFieldSearchFilterConstraint) {
  return { value, constraint };
}

function fromPrimitives(values: SearchFilterValuePrimitives[], constraint?: INestedFieldSearchFilterConstraint) {
  return { values, constraint };
}

function fromString(value: string, constraint?: INestedFieldSearchFilterConstraint) {
  return { value, constraint };
}

function fromRange(start: SearchFilterValuePrimitives, end: SearchFilterValuePrimitives) {
  return { start, end };
}

function fromTemporalRange(
  start: SearchFilterValuePrimitives,
  end: SearchFilterValuePrimitives,
  constraint: ISearchFilterConstraint,
) {
  return { start, end, temporal_constraint: constraint };
}

function searchFilterPairToObject(filter: PairOrFilter): ISearchFilter {
  return Array.isArray(filter) ? searchFilter(filter[0], filter[1]) : filter;
}

function withType<T extends SearchFilterValueType>(type: SearchFilterType) {
  return (value: Omit<T, 'type'>) =>
    ({
      type,
      ...value,
    } as T);
}
