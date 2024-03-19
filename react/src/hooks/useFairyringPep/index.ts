/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions } from "@tanstack/react-query";
import { useClient } from '../useClient';

export default function useFairyringPep() {
  const client = useClient();
  const QueryParams = ( options: any) => {
    const key = { type: 'QueryParams',  };    
    return useQuery([key], () => {
      return  client.FairyringPep.query.queryParams().then( res => res.data );
    }, options);
  }
  
  const QueryEncryptedTx = (targetHeight: string, index: string,  options: any) => {
    const key = { type: 'QueryEncryptedTx',  targetHeight,  index };    
    return useQuery([key], () => {
      const { targetHeight,  index } = key
      return  client.FairyringPep.query.queryEncryptedTx(targetHeight, index).then( res => res.data );
    }, options);
  }
  
  const QueryEncryptedTxAll = (query: any, options: any, perPage: number) => {
    const key = { type: 'QueryEncryptedTxAll', query };    
    return useInfiniteQuery([key], ({pageParam = 1}: { pageParam?: number}) => {
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      return  client.FairyringPep.query.queryEncryptedTxAll(query ?? undefined).then( res => ({...res.data,pageParam}) );
    }, {...options,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  const QueryEncryptedTxAllFromHeight = (targetHeight: string,  options: any) => {
    const key = { type: 'QueryEncryptedTxAllFromHeight',  targetHeight };    
    return useQuery([key], () => {
      const { targetHeight } = key
      return  client.FairyringPep.query.queryEncryptedTxAllFromHeight(targetHeight).then( res => res.data );
    }, options);
  }
  
  const QueryLatestHeight = ( options: any) => {
    const key = { type: 'QueryLatestHeight',  };    
    return useQuery([key], () => {
      return  client.FairyringPep.query.queryLatestHeight().then( res => res.data );
    }, options);
  }
  
  const QueryPepNonce = (address: string,  options: any) => {
    const key = { type: 'QueryPepNonce',  address };    
    return useQuery([key], () => {
      const { address } = key
      return  client.FairyringPep.query.queryPepNonce(address).then( res => res.data );
    }, options);
  }
  
  const QueryPepNonceAll = (query: any, options: any, perPage: number) => {
    const key = { type: 'QueryPepNonceAll', query };    
    return useInfiniteQuery([key], ({pageParam = 1}: { pageParam?: number}) => {
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      return  client.FairyringPep.query.queryPepNonceAll(query ?? undefined).then( res => ({...res.data,pageParam}) );
    }, {...options,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  const QueryPubKey = ( options: any) => {
    const key = { type: 'QueryPubKey',  };    
    return useQuery([key], () => {
      return  client.FairyringPep.query.queryPubKey().then( res => res.data );
    }, options);
  }
  
  return {QueryParams,QueryEncryptedTx,QueryEncryptedTxAll,QueryEncryptedTxAllFromHeight,QueryLatestHeight,QueryPepNonce,QueryPepNonceAll,QueryPubKey,
  }
}
