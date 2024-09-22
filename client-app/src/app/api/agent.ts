import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity } from "../models/activity";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "../stores/store";
import { User, UserFromValues } from "../models/user";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};
axios.defaults.baseURL = "http://localhost:5000/api";

/* Adding Auth Token to each request using Interceptors */

axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* Handling Errors using Interceptors */

axios.interceptors.response.use(
  async (response) => {
    await sleep(1000);
    return response;
  },
  (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;

    switch (status) {
      case 400:
        if (
          config.method === "get" &&
          Object.prototype.hasOwnProperty.call(data.errors, "id")
        ) {
          router.navigate("/not-found");
        }
        if (data.errors) {
          // We need to destructure the data.errors object for a few reasons:
          // 1. To extract individual error messages from the nested structure.
          // 2. To create a flat array of error messages that's easier to handle.
          // 3. To ensure we capture all error messages, even if they're nested differently.
          // 4. To standardize the error format for consistent error handling in our app.
          // 5. To make it easier to display these errors to the user in a meaningful way.
          const modalStateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }
          }
          throw modalStateErrors.flat(); // We are flatting the Error
        } else {
          toast.error(data);
        }
        toast.error("bad request");
        break;
      case 401:
        toast.error("unauthorised");
        break;
      case 403:
        toast.error("forbidden");
        break;
      case 404:
        router.navigate("/not-found");
        break;
      case 500:
        store.commonStore.setServerError(data);
        router.navigate("/server-error");
        break;

      default:
        toast.error("error");
        break;
    }
  }
);

/* Type safe response for axios that can be used for any response */

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
  list: () => requests.get<Activity[]>("/activities"),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: Activity) => requests.post("/activities", activity),
  update: (activity: Activity) =>
    requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del(`/activities/${id}`),
};

const Account = {
  current: () => requests.get<User>("/account"),
  login: (user: UserFromValues) => requests.post<User>("/account/login", user),
  register: (user: UserFromValues) =>
    requests.post<User>("/account/register", user),
};

const agent = {
  Activities,
  Account,
};

export default agent;
