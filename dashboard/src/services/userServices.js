const userService = {
  createUser: async (userData) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      return response.json();
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  },

  getUsers: async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      return response.json();
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  },
  loginUser: async (credentials) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Failed to log in");
      }

      return response.json();
    } catch (error) {
      throw new Error(`Failed to log in: ${error.message}`);
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      return response.json();
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  },

  // Implement update function
};

export default userService;
