import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogNew from "./pages/BlogNew";
import TimestampPrecision2025 from "./pages/blog/TimestampPrecision2025";
import SessionManagementTimestamps from "./pages/blog/SessionManagementTimestamps";
import CachingStrategiesTimestamps from "./pages/blog/CachingStrategiesTimestamps";
import CaseStudies from "./pages/CaseStudies";
import KnowledgeBase from "./pages/KnowledgeBase";
import LogTimestampAnalysis from "./pages/knowledge/LogTimestampAnalysis";
import RateLimitingTimestamps from "./pages/knowledge/RateLimitingTimestamps";
import GraphqlTimestamps from "./pages/knowledge/GraphqlTimestamps";
import CCppUnixTimestamps from "./pages/knowledge/CCppUnixTimestamps";
import GolangUnixTimestamps from "./pages/knowledge/GolangUnixTimestamps";
import TutorialSeries from "./pages/TutorialSeries";
import JavaScriptTimestamps from "./pages/tutorials/JavaScriptTimestamps";
import MonitoringTimestampStrategies from "./pages/tutorials/MonitoringTimestampStrategies";
import CalendarTimestampComponents from "./pages/tutorials/CalendarTimestampComponents";
import WebhookTimestampSecurity from "./pages/tutorials/WebhookTimestampSecurity";
import ElasticsearchTimestampIndexing from "./pages/tutorials/ElasticsearchTimestampIndexing";
import RateLimitingAlgorithms from "./pages/tutorials/RateLimitingAlgorithms";
import LeapSeconds from "./pages/reference/LeapSeconds";
import GraphqlTimestampsPage from "./pages/blog/GraphqlTimestamps";
import ReferenceHub from "./pages/ReferenceHub";
import TimestampPrecision from "./pages/reference/TimestampPrecision";
import ToolsHub from "./pages/ToolsHub";
import TimestampConverter from "./pages/tools/TimestampConverter";
import BatchProcessor from "./pages/tools/BatchProcessor";
import TimezoneConverter from "./pages/tools/TimezoneConverter";
import DurationCalculator from "./pages/tools/DurationCalculator";
import CronGenerator from "./pages/tools/CronGenerator";
import LogParser from "./pages/tools/LogParser";
import ApiFormatter from "./pages/tools/ApiFormatter";
import DbMigration from "./pages/tools/DbMigration";
import AgeCalculator from "./pages/AgeCalculator";
import PercentageCalculator from "./pages/PercentageCalculator";
import BMICalculator from "./pages/BMICalculator";
import GradeCalculator from "./pages/GradeCalculator";
import CalorieCalculator from "./pages/CalorieCalculator";
import BinaryConverter from "./pages/BinaryConverter";
import HashCalculator from "./pages/HashCalculator";
import RegexTester from "./pages/RegexTester";
import FileSizeCalculator from "./pages/FileSizeCalculator";
import DerivativeCalculator from "./pages/DerivativeCalculator";
import IntegralCalculator from "./pages/IntegralCalculator";
import MatrixCalculator from "./pages/MatrixCalculator";
import EquationSolver from "./pages/EquationSolver";
import TemperatureConverter from "./pages/TemperatureConverter";
import TimeCalculator from "./pages/TimeCalculator";
import MortgageCalculator from "./pages/MortgageCalculator";
import CompoundInterestCalculator from "./pages/CompoundInterestCalculator";
import LoanCalculator from "./pages/LoanCalculator";
import Challenges from "./pages/Challenges";
import FunctionReference from "./pages/FunctionReference";
import UserProfile from "./pages/UserProfile";
import AdminDashboard from "./pages/AdminDashboard";
import AllCalculators from "./pages/AllCalculators";
import SitemapPage from "./pages/SitemapPage";
import ContentGenerator from "./pages/ContentGenerator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog-old" element={<Blog />} />
          <Route path="/blog" element={<BlogNew />} />
          <Route path="/blog/:slug" element={<TimestampPrecision2025 />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/knowledge/log-timestamp-analysis" element={<LogTimestampAnalysis />} />
          <Route path="/knowledge/rate-limiting-timestamps" element={<RateLimitingTimestamps />} />
          <Route path="/knowledge/graphql-timestamps" element={<GraphqlTimestamps />} />
          <Route path="/knowledge/c-cpp-unix-timestamps" element={<CCppUnixTimestamps />} />
          <Route path="/knowledge/golang-unix-timestamps" element={<GolangUnixTimestamps />} />
          <Route path="/tutorials" element={<TutorialSeries />} />
          <Route path="/tutorials/javascript-timestamps" element={<JavaScriptTimestamps />} />
          <Route path="/tutorials/monitoring-timestamp-strategies" element={<MonitoringTimestampStrategies />} />
          <Route path="/tutorials/calendar-timestamp-components" element={<CalendarTimestampComponents />} />
          <Route path="/tutorials/webhook-timestamp-security" element={<WebhookTimestampSecurity />} />
          <Route path="/tutorials/elasticsearch-timestamp-indexing" element={<ElasticsearchTimestampIndexing />} />
          <Route path="/tutorials/rate-limiting-timestamp-algorithms" element={<RateLimitingAlgorithms />} />
          <Route path="/reference" element={<ReferenceHub />} />
          <Route path="/reference/leap-seconds" element={<LeapSeconds />} />
          <Route path="/reference/timestamp-precision" element={<TimestampPrecision />} />
          <Route path="/blog/complete-guide-unix-timestamp-precision-2025" element={<TimestampPrecision2025 />} />
          <Route path="/blog/session-management-timestamp-expiration" element={<SessionManagementTimestamps />} />
          <Route path="/blog/caching-strategies-time-sensitive-data" element={<CachingStrategiesTimestamps />} />
          <Route path="/blog/graphql-subscriptions-realtime-timestamps" element={<GraphqlTimestampsPage />} />
          <Route path="/tools" element={<ToolsHub />} />
          <Route path="/tools/timestamp-converter" element={<TimestampConverter />} />
          <Route path="/tools/batch-processor" element={<BatchProcessor />} />
          <Route path="/tools/timezone-converter" element={<TimezoneConverter />} />
          <Route path="/tools/duration-calculator" element={<DurationCalculator />} />
          <Route path="/tools/cron-generator" element={<CronGenerator />} />
          <Route path="/tools/log-parser" element={<LogParser />} />
          <Route path="/tools/api-formatter" element={<ApiFormatter />} />
          <Route path="/tools/db-migration" element={<DbMigration />} />
          <Route path="/age-calculator" element={<AgeCalculator />} />
          <Route path="/percentage-calculator" element={<PercentageCalculator />} />
          <Route path="/bmi-calculator" element={<BMICalculator />} />
          <Route path="/grade-calculator" element={<GradeCalculator />} />
          <Route path="/calorie-calculator" element={<CalorieCalculator />} />
          <Route path="/binary-converter" element={<BinaryConverter />} />
          <Route path="/hash-calculator" element={<HashCalculator />} />
          <Route path="/regex-tester" element={<RegexTester />} />
          <Route path="/file-size-calculator" element={<FileSizeCalculator />} />
          <Route path="/derivative-calculator" element={<DerivativeCalculator />} />
          <Route path="/integral-calculator" element={<IntegralCalculator />} />
          <Route path="/matrix-calculator" element={<MatrixCalculator />} />
          <Route path="/equation-solver" element={<EquationSolver />} />
          <Route path="/temperature-converter" element={<TemperatureConverter />} />
          <Route path="/time-calculator" element={<TimeCalculator />} />
          <Route path="/mortgage-calculator" element={<MortgageCalculator />} />
          <Route path="/compound-interest" element={<CompoundInterestCalculator />} />
          <Route path="/loan-calculator" element={<LoanCalculator />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/function-reference" element={<FunctionReference />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/all-calculators" element={<AllCalculators />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/content-generator" element={<ContentGenerator />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
