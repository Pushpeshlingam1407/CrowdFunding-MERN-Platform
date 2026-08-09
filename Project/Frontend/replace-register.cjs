const fs = require('fs');

let c = fs.readFileSync('src/components/Register.jsx', 'utf8');

c = c.replace(/<RegisterWrapper>/g, '<div className="register-wrapper">');
c = c.replace(/<\/RegisterWrapper>/g, '</div>');
c = c.replace(/<StyledCard>/g, '<div className="register-card">');
c = c.replace(/<\/StyledCard>/g, '</div>');
c = c.replace(/<FormTitle>/g, '<h2 className="register-title">');
c = c.replace(/<\/FormTitle>/g, '</h2>');
c = c.replace(/<FormSubtitle>/g, '<p className="register-subtitle">');
c = c.replace(/<\/FormSubtitle>/g, '</p>');
c = c.replace(/<FormGroup(.*?)>/g, '<div className="register-form-group"$1>');
c = c.replace(/<\/FormGroup>/g, '</div>');
c = c.replace(/<Label>/g, '<label className="register-label">');
c = c.replace(/<\/Label>/g, '</label>');
c = c.replace(/<RoleGrid>/g, '<div className="register-role-grid">');
c = c.replace(/<\/RoleGrid>/g, '</div>');
c = c.replace(/<CheckboxContainer>/g, '<label className="register-checkbox-container">');
c = c.replace(/<\/CheckboxContainer>/g, '</label>');
c = c.replace(/<CriteriaList>/g, '<div className="register-criteria-list">');
c = c.replace(/<\/CriteriaList>/g, '</div>');

// StyledInput replacement (has props)
c = c.replace(/<StyledInput([\s\S]*?)\/>/g, (match, props) => {
  // extract $isValid and $hasError logic to inject into className
  let isValidMatch = props.match(/\$isValid=\{(.*?)\}/);
  let hasErrorMatch = props.match(/\$hasError=\{(.*?)\}/);
  
  let isValidStr = isValidMatch ? isValidMatch[1] : 'false';
  let hasErrorStr = hasErrorMatch ? hasErrorMatch[1] : 'false';
  
  // remove the styled-component props
  let newProps = props
    .replace(/\$isValid=\{.*?\}/g, '')
    .replace(/\$hasError=\{.*?\}/g, '');
    
  return `<input className={\`register-input \${ ${isValidStr} ? "is-valid" : "" } \${ ${hasErrorStr} ? "has-error" : "" }\`} ${newProps} />`;
});

// For ValidationIndicator
c = c.replace(/<ValidationIndicator\s+\$isValid=\{(.*?)\}>/g, '<div className={`register-validation-indicator ${ $1 ? "is-valid" : "has-error" }`}>');
c = c.replace(/<\/ValidationIndicator>/g, '</div>');

// For CriteriaItem
c = c.replace(/<CriteriaItem\s+\$isValid=\{(.*?)\}>/g, '<div className={`register-criteria-item ${ $1 ? "is-valid" : "is-invalid" }`}>');
c = c.replace(/<\/CriteriaItem>/g, '</div>');

// For RoleCard
c = c.replace(/<RoleCard\s+key=\{(.*?)\}\s+\$active=\{(.*?)\}\s+onClick=\{(.*?)\}>/g, '<div key={$1} className={`register-role-card ${ $2 ? "active" : "" }`} onClick={$3}>');
c = c.replace(/<\/RoleCard>/g, '</div>');

fs.writeFileSync('src/components/Register.jsx', c);
console.log('Replaced JSX tags');
