
~~~
#build-only
pnpm  build --base /bbox/
@send-to-dl-dir dist apps/bbox
~~~

# TODO

- [ ] allow to select comment from previous ones, also in the edit view (if you missed the popup)
- [ ] Esc to go back on desktop
- [x] bigger menu bar
- [x] better date-time selection
- [x] options: no-history mode to have "back" quit the app (seems ok?)
- [x] focus the comment field
- [x] without the below rework, simply show popup that suggests recent comments to add (based on the type)
- tentative rework with action to enable predictive actions (or based on state?), e.g. suggest adding a typical comment etc
  - move most functions as store actions
  - use a logging component, https://pinia.vuejs.org/core-concepts/actions.html#Subscribing-to-actions (where to save that...?)

