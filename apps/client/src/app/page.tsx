import Faq from './components/Faq/Faq';
import Features from './components/Features/Features';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Pricing from './components/Pricing/Pricing';

const LandingPage = () => {
	return (
		<main className="relative">
			<Header />
			<Hero />
			<Features />
			<Pricing />
			<Faq />
			<Footer />
		</main>
	);
};

export default LandingPage;
