/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions } from "@tanstack/react-query";
import { useClient } from '../useClient';

export default function useFairyringKeyshare() {
  const client = useClient();
  const QueryCommitments = ( options: any) => {
    const key = { type: 'QueryCommitments',  };    
    return useQuery([key], () => {
      return  client.FairyringKeyshare.query.queryCommitments().then( res => res.data );
    }, options);
  }
  
  const QueryParams = ( options: any) => {
    const key = { type: 'QueryParams',  };    
    return useQuery([key], () => {
      return  client.FairyringKeyshare.query.queryParams().then( res => res.data );
    }, options);
  }
  
  const QueryValidatorSet = (index: string,  options: any) => {
    const key = { type: 'QueryValidatorSet',  index };    
    return useQuery([key], () => {
      const { index } = key
      return  client.FairyringKeyshare.query.queryValidatorSet(index).then( res => res.data );
    }, options);
  }
  
  const QueryValidatorSetAll = (query: any, options: any, perPage: number) => {
    const key = { type: 'QueryValidatorSetAll', query };    
    return useInfiniteQuery([key], ({pageParam = 1}: { pageParam?: number}) => {
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      return  client.FairyringKeyshare.query.queryValidatorSetAll(query ?? undefined).then( res => ({...res.data,pageParam}) );
    }, {...options,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  const QueryKeyShare = (validator: string, blockHeight: string,  options: any) => {
    const key = { type: 'QueryKeyShare',  validator,  blockHeight };    
    return useQuery([key], () => {
      const { validator,  blockHeight } = key
      return  client.FairyringKeyshare.query.queryKeyShare(validator, blockHeight).then( res => res.data );
    }, options);
  }
  
  const QueryKeyShareAll = (query: any, options: any, perPage: number) => {
    const key = { type: 'QueryKeyShareAll', query };    
    return useInfiniteQuery([key], ({pageParam = 1}: { pageParam?: number}) => {
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      return  client.FairyringKeyshare.query.queryKeyShareAll(query ?? undefined).then( res => ({...res.data,pageParam}) );
    }, {...options,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  const QueryAggregatedKeyShare = (height: string,  options: any) => {
    const key = { type: 'QueryAggregatedKeyShare',  height };    
    return useQuery([key], () => {
      const { height } = key
      return  client.FairyringKeyshare.query.queryAggregatedKeyShare(height).then( res => res.data );
    }, options);
  }
  
  const QueryAggregatedKeyShareAll = (query: any, options: any, perPage: number) => {
    const key = { type: 'QueryAggregatedKeyShareAll', query };    
    return useInfiniteQuery([key], ({pageParam = 1}: { pageParam?: number}) => {
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      return  client.FairyringKeyshare.query.queryAggregatedKeyShareAll(query ?? undefined).then( res => ({...res.data,pageParam}) );
    }, {...options,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  const QueryPubKey = ( options: any) => {
    const key = { type: 'QueryPubKey',  };    
    return useQuery([key], () => {
      return  client.FairyringKeyshare.query.queryPubKey().then( res => res.data );
    }, options);
  }
  
  const QueryAuthorizedAddress = (target: string,  options: any) => {
    const key = { type: 'QueryAuthorizedAddress',  target };    
    return useQuery([key], () => {
      const { target } = key
      return  client.FairyringKeyshare.query.queryAuthorizedAddress(target).then( res => res.data );
    }, options);
  }
  
  const QueryAuthorizedAddressAll = (query: any, options: any, perPage: number) => {
    const key = { type: 'QueryAuthorizedAddressAll', query };    
    return useInfiniteQuery([key], ({pageParam = 1}: { pageParam?: number}) => {
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      return  client.FairyringKeyshare.query.queryAuthorizedAddressAll(query ?? undefined).then( res => ({...res.data,pageParam}) );
    }, {...options,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  const QueryGeneralKeyShare = (validator: string, idType: string, idValue: string,  options: any) => {
    const key = { type: 'QueryGeneralKeyShare',  validator,  idType,  idValue };    
    return useQuery([key], () => {
      const { validator,  idType,  idValue } = key
      return  client.FairyringKeyshare.query.queryGeneralKeyShare(validator, idType, idValue).then( res => res.data );
    }, options);
  }
  
  const QueryGeneralKeyShareAll = (query: any, options: any, perPage: number) => {
    const key = { type: 'QueryGeneralKeyShareAll', query };    
    return useInfiniteQuery([key], ({pageParam = 1}: { pageParam?: number}) => {
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      return  client.FairyringKeyshare.query.queryGeneralKeyShareAll(query ?? undefined).then( res => ({...res.data,pageParam}) );
    }, {...options,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  return {QueryCommitments,QueryParams,QueryValidatorSet,QueryValidatorSetAll,QueryKeyShare,QueryKeyShareAll,QueryAggregatedKeyShare,QueryAggregatedKeyShareAll,QueryPubKey,QueryAuthorizedAddress,QueryAuthorizedAddressAll,QueryGeneralKeyShare,QueryGeneralKeyShareAll,
  }
}
