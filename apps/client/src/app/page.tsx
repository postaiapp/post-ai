import Faq from './components/Faq/Faq';
import Features from './components/Features/Features';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';

const LandingPage = () => {
	return (
		<main>
			<Header />
			<Hero />
			<Features />
			<Faq />
			<Footer />
		</main>
	);
};

export default LandingPage;
