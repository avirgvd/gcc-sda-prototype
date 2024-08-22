
import fetch from "isomorphic-fetch";

const BACKEND_HOST = "http://localhost:8000";

export async function restget(endpoint: string) {

  console.log("restget: ", endpoint);
  const url = BACKEND_HOST + endpoint;

  const body = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  console.log(body);

  console.log(url);

  return fetch(url, body)
    .then((response) => {
      console.log(response);
      console.log(response.status);
      if (response.status !== 200) {
        return { "error": response.status, "message": response.statusText };
      }
      return response.json();
    })

}

export async function restpost(endpoint: string, payload: JSON) {

  console.log("Make rest POST: ", payload);
  const url = BACKEND_HOST + endpoint;

  let token = "";

  const body = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
  };

  console.log(body);

  console.log(url);

  return fetch(url, body)
    .then((response) => {
      console.log(response);
      console.log(response.status);
      if (response.status !== 200) {
        return { "error": response.status, "message": response.statusText };
      }
      return response.json();
    })
  // .catch((err) => {
  //   console.log(err);
  //   return err;
  // });

}
