import{g as o}from"./main-e6a5ccf0.js";let n;const c=t=>{n=t,console.log("HugMoodAPI: Apollo client initialized")};o`
  subscription OnNewHug($userId: ID!) {
    newHug(userId: $userId) {
      id
      senderId
      senderName
      senderAvatar
      recipientId
      hugTypeId
      hugTypeName
      message
      sentAt
      status
    }
  }
`;o`
  subscription OnNewHugRequest($userId: ID!) {
    newHugRequest(userId: $userId) {
      id
      requesterId
      requesterName
      requesterAvatar
      recipientId
      hugTypeId
      hugTypeName
      message
      requestedAt
      status
    }
  }
`;o`
  subscription OnHugRequestUpdate($userId: ID!) {
    hugRequestUpdate(userId: $userId) {
      id
      requesterId
      requesterName
      recipientId
      recipientName
      hugTypeId
      hugTypeName
      status
      responseMessage
    }
  }
`;const u=new Map,d=(t,i)=>{try{const r=setInterval(async()=>{try{if(!n){console.error("Apollo client not initialized in hugmoodAPI");return}const{data:e}=await n.query({query:o`
            query GetLatestHugs($userId: ID!) {
              receivedHugs(userId: $userId, limit: 5) {
                id
                senderId
                senderName
                senderAvatar
                recipientId
                hugTypeId
                hugTypeName
                message
                sentAt
                status
              }
            }
          `,variables:{userId:t},fetchPolicy:"network-only"});e.receivedHugs&&e.receivedHugs.length>0&&Math.random()<.1&&i(e.receivedHugs[0])}catch(e){console.error("Error polling for new hugs:",e)}},3e4),s=`newHugs-${t}`;return u.set(s,r),()=>{clearInterval(r),u.delete(s)}}catch(r){return console.error("Error setting up hug subscription:",r),()=>{}}},l=(t,i)=>{try{const r=setInterval(async()=>{try{if(!n){console.error("Apollo client not initialized in hugmoodAPI");return}const{data:e}=await n.query({query:o`
            query GetLatestHugRequests($userId: ID!) {
              receivedHugRequests(userId: $userId, limit: 5) {
                id
                requesterId
                requesterName
                requesterAvatar
                recipientId
                hugTypeId
                hugTypeName
                message
                requestedAt
                status
              }
            }
          `,variables:{userId:t},fetchPolicy:"network-only"});e.receivedHugRequests&&e.receivedHugRequests.length>0&&Math.random()<.05&&i(e.receivedHugRequests[0])}catch(e){console.error("Error polling for new hug requests:",e)}},3e4),s=`newHugRequests-${t}`;return u.set(s,r),()=>{clearInterval(r),u.delete(s)}}catch(r){return console.error("Error setting up hug request subscription:",r),()=>{}}},g=(t,i)=>{try{const r=setInterval(async()=>{try{if(!n){console.error("Apollo client not initialized in hugmoodAPI");return}const{data:e}=await n.query({query:o`
            query GetSentHugRequestUpdates($userId: ID!) {
              sentHugRequests(userId: $userId) {
                id
                requesterId
                requesterName
                recipientId
                recipientName
                hugTypeId
                hugTypeName
                status
                responseMessage
                requestedAt
              }
            }
          `,variables:{userId:t},fetchPolicy:"network-only"});e.sentHugRequests&&e.sentHugRequests.length>0&&Math.random()<.05&&i(e.sentHugRequests[0])}catch(e){console.error("Error polling for hug request updates:",e)}},3e4),s=`hugRequestUpdates-${t}`;return u.set(s,r),()=>{clearInterval(r),u.delete(s)}}catch(r){return console.error("Error setting up hug request update subscription:",r),()=>{}}},p=()=>{u.forEach(t=>{clearInterval(t)}),u.clear()};export{p as cleanupAllSubscriptions,c as initApolloClient,g as subscribeHugRequestUpdates,l as subscribeNewHugRequests,d as subscribeNewHugs};
//# sourceMappingURL=hugmoodAPI-6e2692fc.js.map
