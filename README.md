# CodeGate

CodeGate is an open-source [Feature Flag](https://martinfowler.com/articles/feature-toggles.html) library focused on productivity. Use it anywhere Javascript or Typescript is written. Our API minimizes context switching through:

- Configuration-in-code for easy referencing, versioning and collaboration. Never leave developer environment.
- Declarative gating model, maximizing re-usability and understandability of gating logic.
- Promise based for flexibility and easy rule making. Can utilize any Javascript/Typescript features and libraries in custom logic.

# Core Usage

### Gate

```javascript
if (await gate()) {
  return <DesignA />;
} else {
  return <DesignB />;
}
```

Gates allow developers to manage the conditional execution of codepaths. By configuring a gate's targeting rules we can:

- provide different user experiences conditioned on the users location
- limit codepaths to employees only so new features can be safely tested in production
- gradually rollout features to users to mitigate risk
- condition on complex logic using boolean expressions (AND, OR, NOT)

### Targeting Rules

```javascript
const gate = BuildGate({
  targeting: [
    ruleA, // short form
    {condition: ruleB, allow: 50} // long form
  ],
  ...
})
```

Targeting rules are used to define the behavior of a gate. They're evaluated in sequence and once a rule is matched, subsequent rules are ignored. All users that match ruleA will pass the gate, users that don't match ruleA will next be evaluated by ruleB. If they match ruleB, only 50% will pass. If they don't match ruleB they will not pass the gate. NEED TO ADD MORE ABOUT WHAT HAPPENS AFTER YOU MATCH A GATE AND WHAT SHORT AND LONG FORM MEAN

Rules are functions that return Promises that resolve to true for successful matches and false for unsuccesful matches.

```javascript
const ruleA = function (params) {
  return new Promise((resolve, reject) => {
    resolve(matchingLogic() ? true : false);
  });
};
```

We can also pass paramters to our rules when we call the gate

```javascript
await gate({ userId: '1234' });
```

A rule that utilizes passed in params looks like

```javascript
const useParamsRule = function (params) {
  return new Promise((resolve, reject) => {
    const allowList = ['1234'];
    resolve(allowList.includes(params.userId));
  });
};
```

### Complex Rules

### Built-In Rules

- Node Environment restriction
- Geo Restriction
- ip Restriction
- Subnet Restriction
- Time based Restriction
- Nested gates
- Percentage Restriction

# Aditional Features

### Type Saftey

### Debug Mode

### Audit Logging

### Error Handling

### Disable Usage Analytics

# References

https://martinfowler.com/articles/feature-toggles.html

# Special Thanks

- @jtlong3rd Typescript guru and programming mentor

# License

Apache-2.0

## TODO

- [] Error Handling
  - [] What happens when one of the rules rejects?
  - [] What happens if BuildGate() breaks in some way?
  - [] What happen if CheckGate() breaks in some way?
- [] Debug mode - log results of every step to console
- [] audit log - allow record keeping of gate checks
- [] Easy way to manually test gate, call function in node repl or browser console?
- [] opt-out. Product usage analytics for codegate.
