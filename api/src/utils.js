const { authClient } = require("./authClient");
const pluralize = require("pluralize");

const refreshToken = async () => {
  try {
    const response = await authClient.refresh();

    if (response) {
      const { access_token, refresh_token } = response?.getJson();

      if (access_token) {
        process.env.QB_ACCESS_TOKEN = access_token;
        process.env.QB_REFRESH_TOKEN = refresh_token;
      }
      return response;
    }
  } catch (error) {
    console.error("Failed to refresh token", error);
  }
};

const fetchBills = async (lastInvocationTime, refreshTokenRetries) => {
  try {
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
  } catch (error) {
    console.error(error);
    if (
      error?.authResponse.response?.status === 401 &&
      refreshTokenRetries < 3 &&
      !authClient.isAccessTokenValid()
    ) {
      refreshTokenRetries++;
      await refreshToken();

      return fetchBills(lastInvocationTime);
    }
  }
};

const billChecker = () => {
  let lastInvocationTime = null;
  let previousBills = {};
  let firstInvocation = true;
  let refreshTokenRetries = 0;

  return async () => {
    try {
      const currentTime = new Date().toISOString();
      const response = await fetchBills(
        lastInvocationTime,
        refreshTokenRetries
      );

      const bills = response.json.QueryResponse.Bill || [];
      const newBills = {};
      const added = [];
      const modified = [];

      bills.forEach((bill) => {
        newBills[bill.Id] = bill.MetaData.LastUpdatedTime;

        if (!previousBills[bill.Id]) {
          added.push({ ...bill, actionPerformed: "added" });
        } else if (previousBills[bill.Id] !== bill.MetaData.LastUpdatedTime) {
          modified.push({ ...bill, actionPerformed: "modified" });
        }
      });

      Object.keys(newBills).forEach((id) => {
        previousBills[id] = newBills[id];
      });

      lastInvocationTime = currentTime;

      if (firstInvocation) {
        firstInvocation = false;
        return { message: "No previous invocation" };
      }

      const message = [
        added.length
          ? `${added.length} ${pluralize("addition", added.length)}`
          : null,
        modified.length
          ? `${modified.length} ${pluralize("change", modified.length)}`
          : null,
      ]
        .filter(Boolean)
        .join(" ");

      return {
        bills: [...added, ...modified],
        message: message || "No changes detected",
      };
    } catch (error) {
      console.error(error);
      return "Internal Server Error";
    }
  };
};

module.exports = { checkBills: billChecker() };
