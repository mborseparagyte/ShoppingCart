let serverURL =
  process.env.SERVER_URL || "https://peoplesure_testapp-lv1ws.test.p10.io";
module.exports = {
  eventsLimit: 3,
  AUTH_TOKEN:
    process.env.AUTH_TOKEN ||
    "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImpTcEJjejBIdW01dVlGYnV2T2pQMGdkRml3VSIsImtpZCI6ImpTcEJjejBIdW01dVlGYnV2T2pQMGdkRml3VSJ9.eyJpc3MiOiJodHRwczovL2RldmF1dGgucDEwLmlvL2F1dGgiLCJhdWQiOiJodHRwczovL2RldmF1dGgucDEwLmlvL2F1dGgvcmVzb3VyY2VzIiwiZXhwIjoxNTIyMzAzMTczLCJuYmYiOjE1MjE2OTgzNzMsImNsaWVudF9pZCI6IjZCOUQ0M0QzMDgyMkY5NzZERUExRjM5QTFDMjZEQTY5NzQxNjdDMUMzQkY3QkIwRkQzNjlCNjhCREQ3ODgxNUMiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwiZW1haWwiLCJvZmZsaW5lX2FjY2VzcyIsImJhYXMiXSwic3ViIjoiYWdhbmdhcmRlQHBhcmFneXRlLmNvbSIsImF1dGhfdGltZSI6MTUyMTY5NzUzMCwiaWRwIjoicDEwT0F1dGgiLCJhbXIiOlsiZXh0ZXJuYWwiXX0.NSR2x2Ao3C7tgYxIjLHIJ1WD8Hid_yMvkNsVuO9EHxdg-KuUj-NkJjDUbiZAgxwA_PzvBGZXOw-7WF4Xyprtoe2Slh5pTl-nYOsdXLjPvZJREAdSkN3r8skmMlRpSwmftkwoCkNWIGTILBO9FFvssOLmz8XpYeyuuKpgNvVbwQmcX3-wkXi6_gruOUCxawyHHmjtzLmpNOi-N2nF-_HEIEMoiBp3BNwggsuzKA2ZSSIulkg0LHDzoRmUhsLSggOEm12H9DsIeLgTCBl7D3_30EVqmtPbLo-O3MW1__8I0HZL0bKl1dqrgX-9DFXeb2vWcXmC0RvlnkWlgGsUc0m5Ag",
  ACCESS_KEY:
    process.env.ACCESS_KEY ||
    "64c3813f55aaf42258aa8cac7f4b29e611e918e1c9b4010d8bb3bccfac6ef760d7ddb0db44b158280b62b2fbcb809f72",
  MONTHS: {
    0: "JAN",
    1: "FEB",
    2: "MAR",
    3: "APR",
    4: "MAY",
    5: "JUN",
    6: "JUL",
    7: "AUG",
    8: "SEP",
    9: "OCT",
    10: "NOV",
    11: "DEC"
  },
  serverURL,
  serverAttachmentURL: `${serverURL}/svc/api/Attachments/download/`,
  googleApiKey: "AIzaSyBh-pfpEv9Suo-_dEgeerDMC_qBO0l06G4",
  defaultImageURL:
    "http://www.drvevents.com/wp-content/uploads/2017/01/convention_conad_free_event_12.jpg"
};
