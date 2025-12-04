// Import the registration functions (commented out until needed)
import { registerAstroComponent } from "@cloudcannon/editable-regions/astro";
import { registerReactComponent } from "@cloudcannon/editable-regions/react";

//This import is only necessary if you use React components nested inside your Astro components.
import "@cloudcannon/editable-regions/astro-react-renderer";

// Import components that should be editable in CloudCannon
// Note: Add your components here as needed

// Example component registrations
// Uncomment and modify these lines based on your actual components:

// React/JSX Components
import Navigation from "../components/layouts/navigation.jsx";
import AnimatedNumber from "../components/shared/AnimatedNumber.tsx";
import ThemeSelector from "../components/shared/ThemeSelector.tsx";

// Astro Components
import AboutTeam from "../components/about/team/team.astro";
import AboutVideo from "../components/about/video/video.astro";
import BlogList from "../components/blog/list.astro";
import BlogPagination from "../components/blog/pagination.astro";
import ContactForm from "../components/contact/form/form.astro";
import GlobalCounter from "../components/global/counter/counter.astro";
import GlobalFaq from "../components/global/faq/faq.astro";
import FaqItem from "../components/global/faq/faqItem.astro";
import GlobalFeature from "../components/global/feature/feature.astro";
import GlobalHeader from "../components/global/header/header.astro";
import GlobalHero from "../components/global/hero/hero.astro";
import GlobalLogin from "../components/global/login/login.astro";
import GlobalSignup from "../components/global/signup/signup.astro";
import GlobalSimpleHero from "../components/global/simple-hero/simple-hero.astro";
import GlobalTestimonial from "../components/global/testimonial/testimonial.astro";
import HomeVideo from "../components/home/video/video.astro";
import LayoutsFooter from "../components/layouts/footer.astro";
import PostsSummary from "../components/posts/summary.astro";
import PricingTable from "../components/pricing/table/table.astro";

// Define component registrations with proper typing
const astroComponentRegistrations = [
  { name: "global-counter", component: GlobalCounter },
  { name: "global-hero", component: GlobalHero },
  { name: "home-video", component: HomeVideo },
  { name: "about-team", component: AboutTeam },
  { name: "about-video", component: AboutVideo },
  { name: "contact-form", component: ContactForm },
  { name: "global-faq", component: GlobalFaq },
  { name: "global-feature", component: GlobalFeature },
  { name: "global-header", component: GlobalHeader },
  { name: "global-login", component: GlobalLogin },
  { name: "global-signup", component: GlobalSignup },
  { name: "global-simple-hero", component: GlobalSimpleHero },
  { name: "global-testimonial", component: GlobalTestimonial },
  { name: "layouts-footer", component: LayoutsFooter },
  { name: "pricing-table", component: PricingTable },
  { name: "posts-summary", component: PostsSummary },
  { name: "blog-list", component: BlogList },
  { name: "blog-pagination", component: BlogPagination },
  { name: "global-faq-item", component: FaqItem },
];

// Register your React components with CloudCannon
registerReactComponent("shared/AnimatedNumber", AnimatedNumber);
registerReactComponent("layouts/Navigation", Navigation);
registerReactComponent("shared/ThemeSelector", ThemeSelector);

// Register your Astro components with CloudCannon
astroComponentRegistrations.forEach(({ name, component }): void => {
  registerAstroComponent(name, component);
});
