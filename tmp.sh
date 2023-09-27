fairyringd tx pep create-aggregated-key-share 104 abcd --from alice --chain-id fairytest-1 -y
fairyringd tx pep create-aggregated-key-share 100 abcd --from chris --chain-id fairytest-1 -y
fairyringd tx pep create-aggregated-key-share 103 abcd --from donald --chain-id fairytest-1 -y
# fairyringd tx pep create-aggregated-key-share 101 abce --from bob --chain-id fairytest-1 -y
fairyringd tx bank send fairy12hxz66z2tu0lec9cqjf8q4732v8mepffqm4tyl fairy14afvm0yfs27a00hnr85064r69lpg46zjncasuv 100stake -y
fairyringd tx pep create-aggregated-key-share 101 abcd --from eli --chain-id fairytest-1 -y
fairyringd tx pep create-aggregated-key-share 102 abcd --from fred --chain-id fairytest-1 -y

