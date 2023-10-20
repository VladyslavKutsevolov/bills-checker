const { authClient } = require("./authClient");

const refreshToken = async () => {
  try {
    if (!authClient.getToken().isAccessTokenValid()) {
      const {
        json: { refresh_token, access_token },
      } = await authClient.refresh();

      process.env.QB_ACCESS_TOKEN = access_token;
      process.env.QB_REFRESH_TOKEN = refresh_token;
    }
  } catch (error) {
    console.error("Failed to refresh token", error);
  }
};

const fetchBills = async (lastInvocationTime) => {
  let query = "SELECT * FROM Bill";
  if (lastInvocationTime) {
    query += ` WHERE Metadata.LastUpdatedTime >= '${lastInvocationTime}'`;
  }
  const encodedQuery = encodeURIComponent(query);
  return await authClient.makeApiCall({
    url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${process.env.QB_REALM_ID}/query?query=${encodedQuery}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.QB_ACCESS_TOKEN}`,
      Accept: "application/json",
    },
  });
};

const billChecker = () => {
  let lastInvocationTime = null;
  let previousBills = {};
  let firstInvocation = true;

  return async () => {
    try {
      // await refreshToken();

      const currentTime = new Date().toISOString();
      const response = await fetchBills(lastInvocationTime);

      const bills = response.json.QueryResponse.Bill || [];
      const newBills = {};
      const added = [];
      const modified = [];

      bills.forEach((bill) => {
        newBills[bill.Id] = bill.MetaData.LastUpdatedTime;

        if (!previousBills[bill.Id]) {
          added.push(`Bill ${bill.Id}`);
        } else if (previousBills[bill.Id] !== bill.MetaData.LastUpdatedTime) {
          modified.push(`Bill ${bill.Id}`);
        }
      });

      Object.keys(newBills).forEach((id) => {
        previousBills[id] = newBills[id];
      });

      lastInvocationTime = currentTime;

      if (firstInvocation) {
        firstInvocation = false;
        console.log("RERERERE");
        return { message: "No previous invocation" };
      }

      const message = [
        added.length
          ? `${added.length} addition(s) (${added.join(", ")})`
          : null,
        modified.length
          ? `${modified.length} change(s) (${modified.join(", ")})`
          : null,
      ]
        .filter(Boolean)
        .join(" ");

      return {
        bills: {
          added,
          modified,
        },
        message: message || "No changes detected",
      };
    } catch (error) {
      console.error(error);
      return "Internal Server Error";
    }
  };
};

module.exports = { refreshToken, checkBills: billChecker(), fetchBills };
