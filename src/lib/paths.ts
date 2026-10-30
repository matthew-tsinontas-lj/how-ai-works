export const paths = {
  home: () => '/',
  slide: (lessonId: string, slide: number) => `/lessons/${lessonId}/${slide}`,
  quiz: (lessonId: string) => `/lessons/${lessonId}/quiz`,
  results: (lessonId: string) => `/lessons/${lessonId}/results`,
};
