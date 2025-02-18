'use client';
import React, { useState, useMemo } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const SubruleItem = ({ subrule }) => (
  <div className="pl-8 border-l-2 border-gray-800 mt-4">
    <div className="text-gray-300 font-medium mb-2">
      {subrule.subrule_number && `${subrule.subrule_number})`}
    </div>
    <div className="text-gray-400 text-sm mb-3">
      {subrule.subrule_text}
    </div>
    {subrule.description && (
      <div className="text-gray-500 text-sm italic mb-2">
        {subrule.description}
      </div>
    )}
  </div>
);

const RuleAccordion = ({ rule }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ruleContent, setRuleContent] = useState(null);
  
  const fetchRuleContent = async () => {
    if (!ruleContent && !loading) {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/openlaws/rule/${rule.citation}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch rule content');
        }
        
        const data = await response.json();
        setRuleContent(data.markdown_content);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      fetchRuleContent();
    }
  };
  
  // Function to process OpenLaws markdown content
  const processMarkdown = (content) => {
    if (!content) return '';
    
    // Replace pincite shortcodes with proper HTML - fixed template string
    let processed = content.replace(
      /{{<\s*pincite\s+identifier="([^"]+)"\s+display="([^"]+)"\s*>}}/g,
      '<span class="pincite" data-identifier="$1"><strong>[$2]</strong></span>'
    );

    // Handle list class annotations
    processed = processed.replace(
      /{\s*\.([^}]+)\s*}/g,
      '<div class="$1"></div>'
    );

    // Convert numbered lists with proper classes
    const lines = processed.split('\n');
    let inList = false;
    let listType = '';
    
    const processedLines = lines.map(line => {
      // Detect list type from class annotations
      if (line.includes('lower-alpha')) {
        listType = 'parensLowerAlpha';
        return '';
      }
      if (line.includes('use-pincite-display')) {
        listType = 'usePinciteDisplay';
        return '';
      }

      // Handle list items
      if (line.trim().startsWith('1.')) {
        if (!inList) {
          inList = true;
          return `<ol class="${listType}">\n<li>${line.trim().substring(2).trim()}</li>`;
        }
        return `<li>${line.trim().substring(2).trim()}</li>`;
      }

      // Close list if line is not a list item
      if (inList && !line.trim().startsWith('1.')) {
        inList = false;
        return `</ol>\n${line}`;
      }

      return line;
    });

    return processedLines.join('\n');
  };

  // Updated styles using camelCase and proper CSS-in-JS syntax
  const markdownStyles = {
    // Custom styles for ordered lists
    '.prose ol': {
      listStyleType: 'none',
      counterReset: 'item',
      paddingLeft: '2.5rem',
      position: 'relative',
    },
    '.prose ol > li': {
      counterIncrement: 'item',
      position: 'relative',
      marginBottom: '0.5rem',
    },
    // Style for alpha-numbered lists
    '.prose ol.parensLowerAlpha': {
      counterReset: 'alpha',
    },
    '.prose ol.parensLowerAlpha > li::before': {
      content: '"(" counter(alpha, lower-alpha) ")"',
      position: 'absolute',
      left: '-2.5rem',
      color: '#9CA3AF', // text-gray-400
      fontWeight: '500',
    },
    // Style for decimal-numbered lists
    '.prose ol.parensDecimal': {
      counterReset: 'decimal',
    },
    '.prose ol.parensDecimal > li::before': {
      content: '"(" counter(decimal, decimal) ")"',
      position: 'absolute',
      left: '-2.5rem',
      color: '#9CA3AF', // text-gray-400
      fontWeight: '500',
    },
    // Enhanced typography styles
    '.prose': {
      color: '#D1D5DB', // text-gray-300
      maxWidth: 'none',
    },
    '.prose h1, .prose h2, .prose h3, .prose h4': {
      color: '#F3F4F6', // text-gray-100
      fontWeight: '600',
      marginBottom: '1rem',
    },
    '.prose p': {
      marginBottom: '1rem',
      lineHeight: '1.625',
    },
    '.prose strong': {
      color: '#F3F4F6', // text-gray-100
      fontWeight: '600',
    },
    '.prose em': {
      fontStyle: 'italic',
      color: '#9CA3AF', // text-gray-400
    },
    '.prose ul': {
      listStyleType: 'disc',
      paddingLeft: '1.5rem',
    },
    '.prose ul > li': {
      marginBottom: '0.5rem',
    },
    '.prose table': {
      width: '100%',
      marginTop: '1.5rem',
      marginBottom: '1.5rem',
      borderCollapse: 'collapse',
    },
    '.prose table th': {
      backgroundColor: 'rgba(17, 24, 39, 0.8)', // bg-gray-900/80
      color: '#F3F4F6', // text-gray-100
      padding: '0.75rem',
      textAlign: 'left',
      fontWeight: '600',
      borderBottom: '2px solid #374151', // border-gray-700
    },
    '.prose table td': {
      padding: '0.75rem',
      borderBottom: '1px solid #374151', // border-gray-700
    },
    '.prose blockquote': {
      borderLeftWidth: '4px',
      borderLeftColor: '#374151', // border-gray-700
      paddingLeft: '1rem',
      fontStyle: 'italic',
      color: '#9CA3AF', // text-gray-400
    },
    '.prose code': {
      backgroundColor: 'rgba(17, 24, 39, 0.5)', // bg-gray-900/50
      padding: '0.2rem 0.4rem',
      borderRadius: '0.25rem',
      fontSize: '0.875rem',
      color: '#F3F4F6', // text-gray-100
    },
    // Updated pincite styles
    '.pincite': {
      color: '#60A5FA', // text-blue-400
      marginRight: '0.75rem',
      display: 'inline-block',
    },
    '.pincite strong': {
      color: '#60A5FA', // text-blue-400
      fontWeight: '600',
    },
    
    // Adjust list styles for better hierarchy
    '.prose ol.parensLowerAlpha': {
      counterReset: 'alpha',
      marginLeft: '1rem',
    },
    '.prose ol.parensLowerAlpha > li': {
      position: 'relative',
      paddingLeft: '2.5rem',
      marginBottom: '0.75rem',
    },
    '.prose ol.parensLowerAlpha > li::before': {
      content: '"(" counter(alpha, lower-alpha) ")"',
      position: 'absolute',
      left: '0',
      color: '#9CA3AF', // text-gray-400
      fontWeight: '500',
    },
    
    // Style for lists using pincite display
    '.prose ol.usePinciteDisplay > li': {
      position: 'relative',
      paddingLeft: '0',
      marginBottom: '0.75rem',
    },
    '.prose ol.usePinciteDisplay > li::before': {
      content: 'none',
    },
  };

  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden bg-gray-900/30">
      <button
        onClick={handleToggle}
        className="w-full p-4 flex items-start justify-between hover:bg-gray-900/50 transition-all duration-200"
      >
        <div className="flex flex-col items-start flex-1 pr-4">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-medium">{rule.citation}</span>
          </div>
          <h5 className="text-white font-medium mt-1 text-left">
            {rule.rule_title}
          </h5>
          {rule.description && (
            <p className="text-gray-400 text-sm mt-2 italic">
              {rule.description}
            </p>
          )}
        </div>
        <ChevronDownIcon 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 mt-1 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      
      {isOpen && (
        <div className="p-4 border-t border-gray-800">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">
              Error loading rule content: {error}
            </div>
          ) : ruleContent ? (
            <div className="prose prose-invert prose-sm max-w-none">
              <div 
                style={markdownStyles}
                dangerouslySetInnerHTML={{ 
                  __html: processMarkdown(ruleContent)
                }} 
              />
            </div>
          ) : (
            <div className="text-gray-400 text-center py-4">
              No content available for this rule.
            </div>
          )}
          
          {rule.subrules && rule.subrules.length > 0 && (
            <div className="mt-4">
              {rule.subrules.map((subrule) => (
                <SubruleItem key={subrule.id} subrule={subrule} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ChapterAccordion = ({ chapter }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-start justify-between bg-gray-900/70 hover:bg-gray-900/90 transition-all duration-200"
      >
        <div className="flex flex-col items-start flex-1 pr-4">
          <span className="text-blue-400 font-medium">Chapter {chapter.chapterNumber || chapter.chapterId}</span>
          <h4 className="text-lg font-semibold text-white mt-1 text-left">
            {chapter.chapterTitle}
          </h4>
          <p className="text-gray-400 text-sm mt-1">
            {chapter.ruleCount} Rules
          </p>
        </div>
        <ChevronDownIcon 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 mt-1 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      
      {isOpen && (
        <div className="p-4 bg-gray-900/50 border-t border-gray-700">
          {chapter.rules && chapter.rules.length > 0 ? (
            <div className="space-y-4 mt-6">
              {chapter.rules.map((rule) => (
                <RuleAccordion 
                  key={rule.ruleNumber} 
                  rule={{
                    id: rule.ruleNumber,
                    citation: rule.ruleNumber,
                    rule_title: rule.ruleTitle,
                    rule_text: rule.ruleText || '' // Add fallback for rule text if needed
                  }} 
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No rules found for this chapter.</p>
          )}
        </div>
      )}
    </div>
  );
};

const AgencyAccordion = ({ agency }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sort chapters numerically and filter based on search
  const sortedAndFilteredChapters = useMemo(() => {
    let chapters = [...agency.chapters];
    
    // Sort chapters numerically
    chapters.sort((a, b) => {
      const aNum = parseInt(a.chapterId);
      const bNum = parseInt(b.chapterId);
      return aNum - bNum;
    });
    
    // Filter based on search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      chapters = chapters.filter(chapter => 
        chapter.chapterTitle.toLowerCase().includes(searchLower) ||
        chapter.chapterId.toString().includes(searchLower) ||
        chapter.rules?.some(rule => 
          rule.ruleTitle.toLowerCase().includes(searchLower) ||
          rule.ruleNumber.toLowerCase().includes(searchLower)
        )
      );
    }
    
    return chapters;
  }, [agency.chapters, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Search input */}
      <div className="relative w-full max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search chapters and rules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-800 
            rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 
              hover:text-gray-300 focus:outline-none"
          >
            ✕
          </button>
        )}
      </div>

      {/* Display search results count when searching */}
      {searchTerm && (
        <div className="text-center text-gray-400 mb-4">
          Found {sortedAndFilteredChapters.length} matching chapters
        </div>
      )}

      <div className="space-y-4">
        {sortedAndFilteredChapters.length > 0 ? (
          sortedAndFilteredChapters.map((chapter) => (
            <ChapterAccordion 
              key={chapter.chapterId} 
              chapter={{
                chapterId: chapter.chapterId,
                chapterNumber: chapter.chapterId,
                chapterTitle: chapter.chapterTitle,
                ruleCount: chapter.ruleCount,
                rules: chapter.rules
              }} 
            />
          ))
        ) : (
          <div className="text-center text-gray-400 py-8">
            {searchTerm ? 'No chapters found matching your search' : 'No chapters available'}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgencyAccordion; 