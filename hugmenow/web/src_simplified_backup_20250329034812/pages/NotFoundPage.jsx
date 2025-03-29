import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AnimatedErrorState from '../components/errors/AnimatedErrorState';

function NotFoundPage() {
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      <div className="not-found-page">
        <AnimatedErrorState
          title="404 - Page Not Found"
          description="The page you're looking for doesn't exist or has been moved."
          errorType="route"
          actionText="Go to Home"
          actionLink="/"
          secondaryAction={{
            text: "Go Back",
            onClick: () => navigate(-1)
          }}
        />
      </div>
    </MainLayout>
  );
}

export default NotFoundPage;