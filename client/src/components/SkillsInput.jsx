import React, { useState, useEffect, useRef } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';

const SkillsInput = ({ selectedSkills, onSkillsChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  // Dummy list of skills for demonstration. In a real app, this would come from an API.
  const allSkills = [
    'React',
    'JavaScript',
    'CSS',
    'HTML',
    'Node.js',
    'Express.js',
    'MongoDB',
    'SQL',
    'Python',
    'Django',
    'Flask',
    'Java',
    'Spring Boot',
    'C#',
    'ASP.NET',
    'PHP',
    'Laravel',
    'Ruby',
    'Ruby on Rails',
    'Swift',
    'Kotlin',
    'Android',
    'iOS',
    'AWS',
    'Azure',
    'Google Cloud',
    'Docker',
    'Kubernetes',
    'Git',
    'GitHub',
    'GitLab',
    'Jira',
    'Agile',
    'Scrum',
    'Figma',
    'Sketch',
    'Adobe XD',
    'UI/UX',
    'Responsive Design',
    'REST APIs',
    'GraphQL',
    'TypeScript',
    'Redux',
    'Vue.js',
    'Angular',
    'Sass',
    'Less',
    'Webpack',
    'Babel',
    'Jest',
    'Enzyme',
    'React Testing Library',
    'Cypress',
    'Selenium',
    'PostgreSQL',
    'MySQL',
    'Firebase',
    'Heroku',
    'Netlify',
    'Vercel',
    'CI/CD',
    'Machine Learning',
    'Data Science',
    'Artificial Intelligence',
    'Blockchain',
    'Cybersecurity',
    'Technical Writing',
    'Project Management',
    'Communication',
    'Teamwork',
  ];

  useEffect(() => {
    if (inputValue.length > 0) {
      const filteredSuggestions = allSkills.filter(
        (skill) =>
          skill.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedSkills.includes(skill)
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, selectedSkills]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      onSkillsChange([...selectedSkills, skill]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleSkillRemove = (skillToRemove) => {
    onSkillsChange(selectedSkills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '' && suggestions.length === 0) {
      e.preventDefault();
      const newSkill = inputValue.trim();
      if (!selectedSkills.includes(newSkill)) {
        onSkillsChange([...selectedSkills, newSkill]);
      }
      setInputValue('');
      setShowSuggestions(false);
    } else if (e.key === 'Backspace' && inputValue === '' && selectedSkills.length > 0) {
      onSkillsChange(selectedSkills.slice(0, selectedSkills.length - 1));
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={inputRef}>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedSkills.map((skill) => (
          <span
            key={skill}
            className="flex items-center bg-[var(--primary-color)] text-white px-3 py-1 rounded-full text-sm"
          >
            {skill}
            <IoCloseCircleOutline
              className="ml-2 cursor-pointer"
              onClick={() => handleSkillRemove(skill)}
            />
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        className="px-4 py-2 focus:outline-3 outline-[var(--primary-color)] hover:shadow-md transition-all outline-offset-2 border-2 focus:border-[var(--primary-color)] rounded-xl w-full"
        placeholder={placeholder}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-lg">
          {suggestions.map((skill) => (
            <li
              key={skill}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSkillSelect(skill)}
            >
              {skill}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SkillsInput;
