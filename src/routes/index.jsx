import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../components/Layout/MainLayout'
import Dashboard from '../pages/Dashboard'
import Companies from '../pages/Companies'
import TransactionHistory from '../pages/TransactionHistory'
import CompanyDashboard from '../pages/CompanyDashboard'
import LandingPage from '../pages/LandingPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/dashboard',
    element: (
      <MainLayout>
        <Dashboard />
      </MainLayout>
    ),
  },
  {
    path: '/companies',
    element: (
      <MainLayout>
        <Companies />
      </MainLayout>
    ),
  },
  {
    path: '/transactions',
    element: (
      <MainLayout>
        <TransactionHistory />
      </MainLayout>
    ),
  },
  {
    path: '/marketplace',
    element: (
      <MainLayout>
        <div>Marketplace Page</div>
      </MainLayout>
    ),
  },
  {
    path: '/sustainability',
    element: (
      <MainLayout>
        <div>Sustainability Page</div>
      </MainLayout>
    ),
  },
  {
    path: '/history',
    element: (
      <MainLayout>
        <div>History Page</div>
      </MainLayout>
    ),
  },
  {
    path: '/profile',
    element: (
      <MainLayout>
        <div>Profile Page</div>
      </MainLayout>
    ),
  },
  {
    path: '/company-dashboard',
    element: (
      <MainLayout>
        <CompanyDashboard />
      </MainLayout>
    ),
  },
]) 