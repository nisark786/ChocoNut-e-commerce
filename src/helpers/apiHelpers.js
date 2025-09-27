// src/helpers/apiHelpers.js
import axios from "axios";

export const fetchData = async (url, params = {}) => {
  try {
    const res = await axios.get(url, { params });
    return res.data;
  } catch (err) {
    console.error("API fetch error:", err);
    throw err;
  }
};

export const postData = async (url, data) => {
  try {
    const res = await axios.post(url, data);
    return res.data;
  } catch (err) {
    console.error("API post error:", err);
    throw err;
  }
};

export const patchData = async (url, data) => {
  try {
    const res = await axios.patch(url, data);
    return res.data;
  } catch (err) {
    console.error("API patch error:", err);
    throw err;
  }
};
