import { HttpRequest } from "../HttpRequest.ts";

interface RegisterData {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

interface LoginData {
  login: string;
  password: string;
}

interface UserData {
  id: number;
  first_name: string;
  second_name: string;
  email: string;
  login: string;
  phone: string;
  avatar?: string;
  display_name?: string | null;
}

interface UserProfileData {
  first_name: string;
  second_name: string;
  display_name?: string;
  login: string;
  email: string;
  phone: string;
}

export default class AuthService {
  register(data: RegisterData): Promise<{ id: number }> {
    return HttpRequest.post<RegisterData, { id: number }>("auth/signup", data);
  }

  login(data: LoginData): Promise<void> {
    return HttpRequest.post<LoginData, void>("auth/signin", data);
  }

  getUser(): Promise<UserData> {
    return HttpRequest.get<UserData>("auth/user");
  }

  updateUserProfile(data: UserProfileData): Promise<void> {
    return HttpRequest.put("user/profile", data);
  }

  logout(): Promise<void> {
    return HttpRequest.post<void, void>("auth/logout", undefined);
  }

  updateAvatar(file: File): Promise<{ avatar: string }> {
    const formData = new FormData();
    formData.append("avatar", file);

    return HttpRequest.putFormData("user/profile/avatar", formData);
  }
}
