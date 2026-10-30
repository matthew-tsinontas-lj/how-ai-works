import { Navigate, type RouteObject } from 'react-router';
import { AppLayout } from './AppLayout';
import { HomeScreen } from './screens/HomeScreen';
import { LessonLayout } from './screens/LessonLayout';
import { NotFoundScreen } from './screens/NotFoundScreen';
import { QuizScreen } from './screens/QuizScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { SlidesScreen } from './screens/SlidesScreen';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomeScreen /> },
      {
        path: 'lessons/:lessonId',
        element: <LessonLayout />,
        children: [
          { index: true, element: <Navigate to="1" replace /> },
          { path: 'quiz', element: <QuizScreen /> },
          { path: 'results', element: <ResultsScreen /> },
          { path: ':slide', element: <SlidesScreen /> },
        ],
      },
      { path: '*', element: <NotFoundScreen /> },
    ],
  },
];
