
~~~
#build-only
pnpm  build --base /bbox/
@send-to-dl-dir dist apps/bbox
~~~

# TODO

- [ ] Esc to go back on desktop
- [x] bigger menu bar
- [x] better date-time selection
- [ ] options: no-history mode to have "back" quit the app (seems ok?)
- [x] focus the comment field
- [ ] tentative rework with action to enable predictive actions (or based on state?), e.g. suggest adding a typical comment etc
  - move most functions as store actions
  - use a logging component, https://pinia.vuejs.org/core-concepts/actions.html#Subscribing-to-actions (where to save that...?)

