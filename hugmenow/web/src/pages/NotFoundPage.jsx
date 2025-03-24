import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

function NotFoundPage() {
  return (
    <MainLayout>
      <div className="not-found-page">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default NotFoundPage;