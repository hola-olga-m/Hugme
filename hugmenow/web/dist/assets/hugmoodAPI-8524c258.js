import{g as n,c as i}from"./main-1dd0d4cc.js";n`
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
`;n`
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
`;n`
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
`;const u=new Map,o=(s,a)=>{try{const r=setInterval(async()=>{try{const{data:e}=await i.query({query:n`
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
          `,variables:{userId:s},fetchPolicy:"network-only"});e.receivedHugs&&e.receivedHugs.length>0&&Math.random()<.1&&a(e.receivedHugs[0])}catch(e){console.error("Error polling for new hugs:",e)}},3e4),t=`newHugs-${s}`;return u.set(t,r),()=>{clearInterval(r),u.delete(t)}}catch(r){return console.error("Error setting up hug subscription:",r),()=>{}}},d=(s,a)=>{try{const r=setInterval(async()=>{try{const{data:e}=await i.query({query:n`
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
          `,variables:{userId:s},fetchPolicy:"network-only"});e.receivedHugRequests&&e.receivedHugRequests.length>0&&Math.random()<.05&&a(e.receivedHugRequests[0])}catch(e){console.error("Error polling for new hug requests:",e)}},3e4),t=`newHugRequests-${s}`;return u.set(t,r),()=>{clearInterval(r),u.delete(t)}}catch(r){return console.error("Error setting up hug request subscription:",r),()=>{}}},g=(s,a)=>{try{const r=setInterval(async()=>{try{const{data:e}=await i.query({query:n`
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
          `,variables:{userId:s},fetchPolicy:"network-only"});e.sentHugRequests&&e.sentHugRequests.length>0&&Math.random()<.05&&a(e.sentHugRequests[0])}catch(e){console.error("Error polling for hug request updates:",e)}},3e4),t=`hugRequestUpdates-${s}`;return u.set(t,r),()=>{clearInterval(r),u.delete(t)}}catch(r){return console.error("Error setting up hug request update subscription:",r),()=>{}}},l=()=>{u.forEach(s=>{clearInterval(s)}),u.clear()};export{l as cleanupAllSubscriptions,g as subscribeHugRequestUpdates,d as subscribeNewHugRequests,o as subscribeNewHugs};
//# sourceMappingURL=hugmoodAPI-8524c258.js.map
