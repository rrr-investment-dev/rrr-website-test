export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000/api";

if (!import.meta.env.VITE_API_URL) {
  console.warn("VITE_API_URL environment variable is not defined. Falling back to:", API_BASE_URL);
}

// Fetch posts
export const fetchPosts = async () => {
  try {
    const url = `${API_BASE_URL}/website/posts`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const fetchPostById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/website/posts/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
};

export const fetchFormConfig = async () => {
  try {
    const url = `${API_BASE_URL}/website/contacts/config`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch form config: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching form config:', error);
    throw error;
  }
};

export const submitInquiry = async (responses) => {
  try {
    const url = `${API_BASE_URL}/website/contacts/inquiries/submit`;
    console.log("Attempting to submit inquiry to:", url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ responses }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to submit inquiry: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    throw error;
  }
};

export const fetchTeamMembers = async () => {
  try {
    const url = `${API_BASE_URL}/website/teams`;
    console.log("Attempting to fetch team members from:", url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch team members: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
};
