export interface UserResponse {
    message: string;
    token: string;
    user: {
        _id: string;
        username: string;
        email: string;
        level?: string; 
        firstName?: string;  
        lastName?: string;   
        profilePicUrl?: string;
        createdAt?: string;
    };
}
  