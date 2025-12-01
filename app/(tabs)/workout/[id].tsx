import { RouteProp, useRoute } from '@react-navigation/native';

import WorkoutPage from '@/components/Pages/WorkoutPage';
import ExercisesPage from '@/components/Pages/ExercisesPage';
import ExercisePage from '@/components/Pages/ExercisePage';
import asyncStorage from '@/lib/asyncStorage';

type WorkoutRouteParams = {
    Workout: {
        id: string;
        exercise_id?: string;
        page_type: 'workout' | 'exercises' | 'exercise';
    };
};

const Workout = () =>
{
    const { setCategoryId } = asyncStorage();

    const route = useRoute<RouteProp<WorkoutRouteParams, 'Workout'>>();
    const { id, page_type } = route.params;

    if(page_type === 'workout') setCategoryId(id).then();

    return page_type === 'workout'
        ? <WorkoutPage id={id} />
        : page_type === 'exercises' ?
            <ExercisesPage id={id} />
            : <ExercisePage id={id} exercise_id={route.params.exercise_id} />;
};

export default Workout;
