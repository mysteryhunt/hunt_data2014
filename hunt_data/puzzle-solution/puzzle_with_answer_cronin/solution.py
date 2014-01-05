#!/usr/bin/python

import sys
import hashlib
import string

"""
Install pysha3:

Download pysha3 from: https://pypi.python.org/pypi/pysha3/0.3#downloads

On Windows, run the installer appropriate for your versions of Windows and Python.

On Linux or Mac, run:
$ python setup.py build
$ sudo python setup.py install
"""

if sys.version_info < (3, 4):
	import sha3

# Add these to the list of supported algorithms
hashlib.algorithms += ('sha3_256', 'sha3_384', 'sha3_512')

def decode_level(level):
	
	# Figure out which algorithm is used for this level
	algorithm = None
	blank_digest = None
	for a in hashlib.algorithms:
		blank_digest = hashlib.new(a).hexdigest()
		if level.startswith(blank_digest):
			algorithm = a
			break
	assert algorithm is not None
	assert blank_digest is not None
	
	# Digest length for this algorithm, in characters
	digest_length = hashlib.new(algorithm).digest_size * 2
	
	# Decode this level, digest-by-digest
	out = ''
	hash = None
	for i in range(0,len(level),digest_length):
	
		# A blank digest corresponds to a new word, so reset the hash object
		if level[i:i+digest_length] == blank_digest:
			hash = hashlib.new(algorithm)
			out += ' '
			continue
	
		# Check every character until it matches this hash
		for c in string.printable:
			assert hash is not None
			hash_copy = hash.copy()
			hash_copy.update(c)
			
			# If it matches, add this character to the output and update the hash
			if hash_copy.hexdigest() == level[i:i+digest_length]:
				out += c
				hash.update(c)
				break
	
	return out

def decode_all(filename):

	# Read the file
	with open(filename,'r') as filehandle:
		level = filehandle.read()
	
	# Decode each level until we run out of levels
	while len(level) > 200:
		# Look for the last space, start at the next character
		start = level[:200].rfind(' ')+1
		level = decode_level(level[start:])
		print level[1:200]

if __name__ == '__main__':
	decode_all('data.txt')