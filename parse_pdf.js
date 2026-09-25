const fs = require('fs');

const PDF_TEXT = `01 — SPOTLIGHT 
Ideas, Insights, and Conversations That Inspire Action 
Spotlight is an interactive session that brings students closer to entrepreneurs, industry professionals, and thought leaders. The event creates a platform for meaningful conversations about business, innovation, technology, leadership, and professional growth. Participants get the opportunity to hear about real experiences, understand the challenges faced by industry professionals, and explore how ideas develop into practical ventures. Through engaging discussions and personal insights, the session encourages curiosity and provides a broader understanding of the entrepreneurial and professional world. Whether you're interested in entrepreneurship, career development, or emerging industry trends, Spotlight offers an opportunity to learn from experienced individuals and gain perspectives that extend beyond the classroom. 

02 — CROSSROADS 
Every Decision Creates a New Direction 
Crossroads is a business case-study competition that places participants in real-world business situations. Teams step into the roles of decision-makers and work together to understand challenges, identify opportunities, and develop practical strategies. Participants may take on roles such as CEO, CTO, Marketing Manager, or Finance Head, allowing them to examine a business problem from different perspectives. Each team must analyse the given situation, evaluate possible approaches, and prepare a solution that addresses the central challenge. The competition concludes with teams presenting their strategies and defending their decisions. Through this experience, participants explore the complexities of business management, teamwork, and strategic thinking in a competitive environment. 

03 — STARTUP EXPO 
Meet the Ideas Shaping Tomorrow's Businesses . 
Startup Expo provides a platform for startups and emerging ventures to present their products, services, and innovative ideas to a wider audience. The event allows participants to interact directly with founders, understand the problems their startups are addressing, and learn how different businesses develop solutions for their customers. It creates an environment where innovation can be explored through conversations and demonstrations. For startups, the expo offers an opportunity to increase visibility, receive audience feedback, and connect with students and members of the entrepreneurial ecosystem. For visitors, it offers a closer look at the ideas and businesses being developed around them. 

04 — BRAND BATTLES 
The Ultimate Rival Brand Defense Debate 
Brand Battles is a competitive debate where participants represent rival brands from the same industry. Teams must defend their chosen brand by using research, relevant data, real-world examples, and well-structured arguments. The event encourages participants to examine how brands compete, communicate their value, attract customers, and establish their position in the market. Teams must understand their own brand as well as the strategies of their competitors. As the debate progresses, participants present their viewpoints, challenge opposing arguments, and respond to questions. The event combines brand analysis, business reasoning, and persuasive communication in an engaging competitive format. 

05 — IPL AUCTION 
Bid Smart. Build Strong. Own the Game. 
IPL Auction is a simulated cricket auction in which participants take on the role of franchise owners and compete to build their ideal cricket team. Each team must make careful decisions while working within a limited budget. Participants evaluate available players, decide when to place bids, and manage their finances throughout the auction. Every purchase affects the remaining budget and the team's ability to acquire other players, making planning an important part of the experience. The event combines cricket knowledge with strategic thinking, financial management, and competitive bidding. Participants must balance their preferences with their budget while working towards building a strong and well-planned squad. 

06 — HUSTLE MANIA 
On-Ground Marketing, Selling & Negotiation 
Hustle Mania is an interactive selling and marketing event where participants operate stalls and sell products of their choice. It gives students an opportunity to experience the practical side of business by engaging directly with potential customers. Participants decide how to present their products, attract attention, communicate value, and respond to customer questions. They must adjust their approach based on customer reactions while working to generate sales in a competitive environment. The event transforms selling into a hands-on experience, allowing participants to explore the realities of customer interaction, marketing, negotiation, and business communication. Every conversation becomes an opportunity to understand customer preferences and improve the selling approach. 

07 — INTERNSHIP DRIVE 
Connect with Opportunities. Explore Your Career Direction. 
Internship Drive brings students and participating startups or organisations together to explore internship and career opportunities. The event provides a platform for students to learn about different professional roles, understand workplace expectations, and interact with organisations from various industries. Participating organisations can introduce their work, explain available opportunities, and connect with students who are interested in gaining practical experience. Students can discuss potential roles, understand relevant requirements, and learn more about the skills needed in professional environments. By bringing employers and students into one space, Internship Drive encourages meaningful interaction and helps participants explore possible career directions beyond their academic studies. 

08 — STARTUP POLY 
A Business Simulation Where Every Decision Matters 
Startup Poly is a live, startup-themed business simulation inspired by the mechanics of a board game. Teams compete to build and manage a valuable business portfolio within a fixed gameplay period. Participants begin with available funds and move across a specially designed board, where they encounter opportunities to acquire and upgrade businesses. Throughout the game, teams must manage their finances, evaluate investments, respond to changing situations, and make decisions that influence their business growth. The simulation introduces participants to business concepts through an engaging and competitive format. Instead of simply discussing entrepreneurship, teams experience the challenges of managing resources, taking risks, responding to competition, and making decisions within limited time and money. 

09 — E-CELL MEET 
Ideas Across Campuses. Connections Beyond Boundaries. 
E-Cell Meet is an inter-college gathering that brings together entrepreneurship cells, student leaders, and innovation communities from different institutions. The event provides a space for participants to exchange experiences, discuss initiatives, and explore opportunities for collaboration. Representatives from different E-Cells can share their approaches to organising events, engaging students, supporting innovation, and promoting entrepreneurship on their campuses. The gathering encourages open discussions about common challenges and possible ways to strengthen student-led initiatives. Through conversations and networking, E-Cell Meet aims to build stronger connections between campus entrepreneurship communities and create opportunities for future partnerships and collaborative activities. 

10 — PITCH DECK 
From Vision to Venture 
Pitch Deck is a startup pitching platform where selected teams present their business ideas before investors, mentors, and industry professionals. The event gives aspiring entrepreneurs an opportunity to explain their ventures and receive feedback from experienced members of the business ecosystem. Participants present important aspects of their startup, including the problem they aim to solve, their proposed solution, target customers, business model, market opportunity, and future plans. They must communicate their ideas clearly while responding to questions from the panel. The session provides exposure to the pitching process and helps participants understand how business ideas are presented and evaluated. Through feedback and interaction with the panel, teams can gain new perspectives on their concepts and identify areas for further improvement.`;

console.log("Saving extracted text.");
fs.writeFileSync("extracted_pdf_data.txt", PDF_TEXT);
