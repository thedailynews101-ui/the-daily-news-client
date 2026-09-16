"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AUTH_ME_QUERY_KEY } from "@/components/auth/AuthProvider";
import { getApiErrorMessage } from "@/lib/api-error";
import { logout } from "@/services/auth.service";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: (response) => {
      // #region agent log
      const queryBefore = queryClient.getQueryCache().find({ queryKey: AUTH_ME_QUERY_KEY });
      fetch('http://127.0.0.1:7579/ingest/dcec5555-5b6c-4a43-bb0d-e7523cdc3d5d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'35c314'},body:JSON.stringify({sessionId:'35c314',runId:'post-fix',hypothesisId:'H1',location:'use-logout.ts:19',message:'logout onSuccess: BEFORE cache writes',data:{path:typeof window!=='undefined'?window.location.pathname:null,hasCachedUser:!!queryClient.getQueryData(AUTH_ME_QUERY_KEY),queryExists:!!queryBefore,observerCount:queryBefore?.observers.length??-1,status:queryBefore?.state.status},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      // Write the logged-out value into the *live* auth/me query first, while
      // AuthProvider is still subscribed to it. clear() destroys that query
      // object, and anything written afterwards lands on a replacement with no
      // observers - which is why the navbar used to keep the old user until a
      // manual refresh.
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, null);
      // Everything else in the cache belonged to the session that just ended.
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== AUTH_ME_QUERY_KEY[0],
      });
      // #region agent log
      const queryAfter = queryClient.getQueryCache().find({ queryKey: AUTH_ME_QUERY_KEY });
      fetch('http://127.0.0.1:7579/ingest/dcec5555-5b6c-4a43-bb0d-e7523cdc3d5d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'35c314'},body:JSON.stringify({sessionId:'35c314',runId:'post-fix',hypothesisId:'H1',location:'use-logout.ts:29',message:'logout onSuccess: AFTER setQueryData(null)+removeQueries',data:{cachedValueIsNull:queryClient.getQueryData(AUTH_ME_QUERY_KEY)===null,queryExists:!!queryAfter,observerCount:queryAfter?.observers.length??-1,status:queryAfter?.state.status,isSameQueryObjectAsBefore:queryBefore===queryAfter},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      toast.success(response.message);
      // #region agent log
      fetch('http://127.0.0.1:7579/ingest/dcec5555-5b6c-4a43-bb0d-e7523cdc3d5d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'35c314'},body:JSON.stringify({sessionId:'35c314',runId:'pre-fix',hypothesisId:'H2',location:'use-logout.ts:35',message:'logout onSuccess: calling router.replace("/")',data:{currentPath:typeof window!=='undefined'?window.location.pathname:null,isAlreadyOnTarget:typeof window!=='undefined'&&window.location.pathname==='/'},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      router.replace("/");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
