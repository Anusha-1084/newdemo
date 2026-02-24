
const BASE_URL = 'http://localhost:8888';

export const environment = {
    production: true,
    baseUrl:`${BASE_URL}`,
    apiUrl: `${BASE_URL}/auth`,
    courseUrl:`${BASE_URL}/courses/create-course`,
    courseModuleUrl:`${BASE_URL}/api/course-modules`,
    lessonUrl:`${BASE_URL}/api/lessons`
  };

