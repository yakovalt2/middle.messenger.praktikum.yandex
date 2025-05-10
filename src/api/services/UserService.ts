import { HttpRequest } from "../HttpRequest";

export default class UserService {
  searchUsers(login: string): Promise<unknown> {
    return HttpRequest.post("user/search", { login });
  }

  updateProfile(data: {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    phone: string;
  }): Promise<void> {
    return HttpRequest.put("/user/profile", data);
  }

  updateAvatar(data: FormData): Promise<void> {
    return HttpRequest.put("/user/profile/avatar", data);
  }

  updatePassword(data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<void> {
    return HttpRequest.put("/user/password", data);
  }
}
