
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/SMS-GCA-3H/Registrar/backend/api/cr/crApi.php",
});

export const getSections = async () => {
  const res = await api.get("?path=sections");
  return res.data;
};

// FIXED ✔ (added schoolYearId + correct name)
export const getSectionStudents = async (sectionId, schoolYearId = 1) => {
  const res = await api.get(
    `?path=sections/${sectionId}/students&schoolYearId=${schoolYearId}`
  );
  return res.data;
};

export const notifyTeacher = async (sectionId) => {
  const res = await api.post(`?path=sections/${sectionId}/notify-teacher`);
  return res.data;
};

export const notifyParents = async (sectionId) => {
  const res = await api.post(`?path=sections/${sectionId}/notify-parents`);
  return res.data;
};