// 📌 src/app/models/user.model.ts
export interface UserResponse {
    message: string;
    token: string;
    user: {
        _id: string;
        username: string;
        email: string;
        level?: string; // 🔹 `level` este opțional
    };
}
  